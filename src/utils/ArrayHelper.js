class ArrayHelper {
    _logger;

    constructor(logger) {
        this._logger = logger;
    }

    async mergeItemIntoArray(itemToMerge, array) {
        let index = array.findIndex(item => {
            return item.id === itemToMerge.id
        });

        if (index >= 0) {
            this._logger.debug('found the index: ' + index);
            array.splice(index, 1, itemToMerge);
        }
        else {
            this._logger.warn('failed to find the index in the array for item: ' + JSON.stringify(itemToMerge));
        }

        return array;
    }

    async removeItemFromArray(idToRemove, array) {
        let index = array.findIndex(item => {
            return item.id === idToRemove
        });

        if (index >= 0) {
            this._logger.debug('Found a match for id: ' + idToRemove);
        }

        return array;
    }

}

export default ArrayHelper;