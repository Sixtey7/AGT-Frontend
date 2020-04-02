import axios from 'axios'
import ArrayHelper from '../utils/ArrayHelper';

// URL to find the backend category service at
const CATEGORY_URL = 'http://localhost:5000/categories/';

class CategoryModel {
    categoryArray;
    _arrayHelper;
    _logger;

    /**
     * Builds a clean instance of the category model
     * Queries the backend for all of the categories
     * @param {Object} logger The logger instance to be used 
     */
    constructor(logger) {
        this._logger = logger;
        this._logger.debug('Standing up the Category Model!');
        this.categoryArray = new Array();
        this._arrayHelper = new ArrayHelper(logger);

        axios
            .get(CATEGORY_URL)
            .then(response => {
                this._logger.debug('Got the response: ' + JSON.stringify(response.data));

                this.categoryArray = response.data;

                this._logger.debug('Category Array is: ' + this.categoryArray.length + ' items long!');
            });
    }

    /**
     * Adds the provided category (new or updated) to the collection and sends it to the backend to be persisted
     * @param {Category} categoryToSave the Category object to be saved
     */
    async saveCategory(categoryToSave) {
        //determine if this is an existing category or a new one
        if (categoryToSave.id) {
            this._logger.debug('saving an edited category: ' + JSON.stringify(categoryToSave));

            let returnValue = await this._putCategory(categoryToSave);

            if (returnValue) {
                this.categoryArray = await this._arrayHelper.mergeItemIntoArray(categoryToSave, this.categoryArray);
            }
            else {
                this._logger.error('failed to put the category');
            }
        }
        else {
            this._logger.debug('adding a new category: ' + JSON.stringify(categoryToSave));

            let returnValue = await this._postCategory(categoryToSave);

            if (returnValue) {
                categoryToSave.id = returnValue.id;
                this.categoryArray.push(categoryToSave);
            }
            else {
                this._logger.error('faield to post player for: ' + JSON.stringify(categoryToSave));
            }
        }
    }

    /**
     * Removes the category with the provided id from the maintained collection 
     * and calls the backend to delete it
     * @param {String} idToDelete string containing the UUID to be saved 
     */
    async deleteCategory(idToDelete) {
        this._logger.debug('Deleting a category with id: ' + idToDelete);

        let returnValue = await this._deleteCategory(idToDelete);

        if (returnValue) {
            this.categoryArray = this._arrayHelper.removeItemFromArray(idToDelete, this.categoryArray);
        }
        else {
            this._logger.error('failed to delete category with id: ' + idToDelete);
        }
    }

    /**
     * Helper method used to call the put endpoint on the backend
     * @param {Category} categoryToPut Category object to be sent to the backend 
     * @private
     */
    async _putCategory(categoryToPut) {
        let categoryJSON = JSON.stringify(categoryToPut);

        let returnValue = '';
        axios({
            method: 'put',
            url: CATEGORY_URL + categoryToPut.id,
            headers: {
                'Content-type': 'application/json'
            },
            data:
                categoryJSON
        })
        .then(response => {
            this._logger.debug('got the response from the put: ' + JSON.stringify(response.data));
            returnValue = response.data;
        })
        .catch(err => {
            this._logger.error('got an error from attempting the put: ' + err);
        });

        return returnValue;
    }

    /**
     * Helper method used to call the post endpoint on the backend
     * @param {Category} categoryToPost the Category object to be sent to the backend 
     * @private
     */
    async _postCategory(categoryToPost) {
        //need to delete the empty id to prevent the backend from being confused
        delete categoryToPost.id;
        let categoryJSON = JSON.stringify(categoryToPost);

        let returnValue = '';
        await axios({
            method: 'post',
            url: CATEGORY_URL,
            headers: {
                'Content-Type': 'application/json'
            },
            data:
                categoryJSON
        })
        .then(response => {
            this._logger.debug('Got the response from the post: ' + JSON.stringify(response.data));
            if (response.status === 200) {
                this._logger.debug('Successfully posted the category');
                returnValue = response.data;
            }
            else {
                this._logger.warn('Got a negative status from the category post: ' + response.status);
            }
        })
        .catch(err => {
            this._logger.error('Got an error attempting to post the category: ' + err);
        });

        return returnValue;
    }

    /**
     * Helper method used to call the delete endpoint on the backend
     * @param {String} idToDelete String containing the UUID to be sent to the backend 
     * @private
     */
    async _deleteCategory(idToDelete) {
        this._logger.debug('Deleting a category with id: ' + idToDelete);

        let returnValue = false;

        await axios({
            method: 'DELETE',
            url: CATEGORY_URL + idToDelete
        })
        .then(response => {
            if (response.status === 200) {
                returnValue = true;
            }
            else {
                this._logger.error('Failed to delete a player with id: ' + idToDelete + ' got the status: ' + response.status);
            }
        });

        return returnValue;
    }
}

export default CategoryModel;
