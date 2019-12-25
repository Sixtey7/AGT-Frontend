import axios from 'axios'
import ArrayHelper from '../utils/ArrayHelper';

const CATEGORY_URL = 'http://localhost:5000/categories/';

class CategoryModel {
    categoryArray;
    _arrayHelper;
    _logger;

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
}

export default CategoryModel;