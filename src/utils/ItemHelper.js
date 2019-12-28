class ItemHelper {
    _logger

    constructor(logger) {
        this._logger = logger;
    }

    massageItems(itemArray) {
        //TODO: need to put in a method here to process the 'current_value' property, since it is sometimes "true" but needs to be Boolean(true)
        return itemArray;
    }

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