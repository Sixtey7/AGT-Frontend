/**
 * Class used to facilitate working with items within the frontend
 */
class ItemHelper {
    _logger

    constructor(logger) {
        this._logger = logger;
    }

    /**
     * Massages the item array returned from the backend for easy handling by the frontend
     * @param {Array} itemArray The array to be massaged
     */
    massageItems(itemArray) {
        this._logger.debug('Array before massaging: ' + JSON.stringify(itemArray));
        itemArray.forEach(item => {
            if (item.item_type === 'one_and_done') {
                item.current_value = (item.current_value === 'true');
            }
        })

        this._logger.debug('Array after massaging: ' + JSON.stringify(itemArray));
        return itemArray;
    }

    /**
     * Creates a mapping to Category_Id to Items based on the provided item array
     * @param {Array} itemArray The array of items to turn into a map
     * @returns {Map} Map of items based on what category they belonged to 
     */
    createMapByCategory(itemArray) {
        this._logger.debug('creating a map from: ' + JSON.stringify(itemArray));
        let returnMap = new Map();
        itemArray.forEach(item => {
            this._logger.debug('running for: ' + JSON.stringify(item));
            if (item.category_id in returnMap) {
                this._logger.debug('found a match for category: ' + item.category_id);
                returnMap[item.category_id].push(item);
            }
            else {
                this._logger.debug('did not find a match for: ' + item.category_id);
                let newArray = new Array();
                newArray.push(item);
                returnMap[item.category_id] = newArray;
            }
        });

        this._logger.debug('returning the map: ' + JSON.stringify(returnMap));
        return returnMap;
    }
}

export default ItemHelper;