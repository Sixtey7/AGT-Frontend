class ArrayHelper {
    _logger;

    constructor(logger) {
        this._logger = logger;
    }

    /**
     * Puts the provided object into the provided array.  Replaces an item if a matching item with the same 'id' is found. 
     * If not, the item is appended to the end of the array
     * @param {Object} itemToMerge The object to be merged into the provided array
     * @param {Array} array The array to merge the item in to
     */
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
            array.push(itemToMerge);
        }

        return array;
    }

    /**
     * Removes the item with the specified 'id' from the provided array
     * @param {String} idToRemove The id of the item to be removed from the array, nominally a uuid
     * @param {Array} array The array to remove the item from
     */
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