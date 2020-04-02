import axios from 'axios'
import ArrayHelper from '../utils/ArrayHelper';
import ItemHelper from '../utils/ItemHelper';
import DateHelper from '../utils/DateHelper';

// URL to find the backend item service at
const ITEM_URL = 'http://localhost:5000/items/';

/**
 * Model class used to store the item array and communicate with the backend
 */
class ItemModel {
    itemArray;
    _arrayHelper;
    _itemHelper;
    _dateHelper;
    _logger;

    /**
     * Builds a new clean instance of the item model
     * Queries the backend for all of the items
     * @param {Object} logger - logger to be used by the process 
     */
    constructor(logger) {
        this._logger = logger;
        this._logger.debug('Standing up the Item Model!');
        this.itemArray = new Array();
        this._arrayHelper = new ArrayHelper(logger);
        this._itemHelper = new ItemHelper(logger);
        this._dateHelper = new DateHelper(logger);
        
        axios
            .get(ITEM_URL)
            .then(response => {
                this._logger.debug('Got the response: ' + JSON.stringify(response.data));

                this.itemArray = this._itemHelper.massageItems(response.data);

                this._logger.debug('Item Array is: ' + this.itemArray.length + ' items long!');
            });
    }

    /**
     * Adds the provided item (new or update) to the collection and sends it to the backend
     * @param {Item} itemToSaveInput The item to be saved to the backend
     */
    async saveItem(itemToSaveInput) {
        //deep copy the item before manipulating it
        let itemToSave = JSON.parse(JSON.stringify(itemToSaveInput));

        // massage the item to prep it for sending to the backend
        this._logger.debug('Item before passing to massage: ' + JSON.stringify(itemToSave));
        this._itemHelper.massageItemForBackend(itemToSave);
        this._logger.debug('Item after passing to massage: ' + JSON.stringify(itemToSave));
        
        //determine if this is an existing item or a new one
        if (itemToSave.id) {
            this._logger.debug('saving an edited item: ' + JSON.stringify(itemToSave));

            let returnValue = await this._putItem(itemToSave);

            if (returnValue) {
                // for now, there is nothing special that needs to happen here, 
                    // since the frontend has the same view of the object as the backend
                this._logger.debug('successfully put the item!');
            }
            else {
                this._logger.error('failed to put the item');
            }
        }
        else {
            this._logger.debug('adding a new item: ' + JSON.stringify(itemToSave));

            let returnValue = await this._postItem(itemToSave);

            if (returnValue) {
                itemToSave.id = returnValue.id;
                this.itemArray.push(itemToSave);
            }
            else {
                this._logger.error('faield to post event for: ' + JSON.stringify(itemToSave));
            }
        }
    }

    /**
     * Removes the item with the provided id from the maintainined collection and tells the backedn to delete it
     * @param {String} idToDelete String containing the UUID to be deleted 
     */
    async deleteItem(idToDelete) {
        this._logger.debug('Deleting an item with id: ' + idToDelete);

        let returnValue = await this._deleteItem(idToDelete);

        if (returnValue) {
            this.itemArray = this._arrayHelper.removeItemFromArray(idToDelete, this.itemArray);
        }
        else {
            this._logger.error('failed to delete item with id: ' + idToDelete);
        }
    }

    /**
     * Helper method used to call the put endpoint on the backend
     * @param {Item} itemToPut the item to be sent to the backend
     * @private 
     */
    async _putItem(itemToPut) {
        let itemJSON = JSON.stringify(itemToPut);

        let returnValue = '';
        await axios({
            method: 'put',
            url: ITEM_URL + itemToPut.id,
            headers: {
                'Content-type': 'application/json'
            },
            data:
                itemJSON
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
     * @param {Item} itemToPost the item to be sent to the backend
     * @private 
     */
    async _postItem(itemToPost) {
        //need to delete the empty id to prevent the backend from being confused
        delete itemToPost.id;
        let itemJSON = JSON.stringify(itemToPost);

        let returnValue = '';
        await axios({
            method: 'post',
            url: ITEM_URL,
            headers: {
                'Content-Type': 'application/json'
            },
            data:
                itemJSON
        })
        .then(response => {
            this._logger.debug('Got the response from the post: ' + JSON.stringify(response.data));
            if (response.status === 200) {
                this._logger.debug('Successfully posted the item');
                returnValue = response.data;
            }
            else {
                this._logger.warn('Got a negative status from the item post: ' + response.status);
            }
        })
        .catch(err => {
            this._logger.error('Got an error attempting to post the item: ' + err);
        });

        return returnValue;
    }

    /**
     * Helper method used to call the delete endpoint on the backend
     * @param {String} idToDelete UUID of the item to delete from the backend
     * @private 
     */
    async _deleteItem(idToDelete) {
        this._logger.debug('Deleting a item with id: ' + idToDelete);

        let returnValue = false;

        await axios({
            method: 'DELETE',
            url: ITEM_URL + idToDelete
        })
        .then(response => {
            if (response.status === 200) {
                returnValue = true;
            }
            else {
                this._logger.error('Failed to delete an item with id: ' + idToDelete + ' got the status: ' + response.status);
            }
        })
        .catch(err => {
            this._logger.error('got an error attempting to delete an item: ' + err);
        });

        return returnValue;
    }
}

export default ItemModel;
