/**
 * Class used to facilitate working with items within the frontend
 */
import moment from 'moment'
import DateHelper from './DateHelper';
class ItemHelper {
    _logger;
    _dateHelper;

    constructor(logger) {
        this._logger = logger;
        this._dateHelper = new DateHelper(logger);
    }

    /**
     * Fleshes out the newly created item by filling out any default properties that are needed
     * @param {Object} item the item to be fleshed out
     */
    createNewItem(item) {
        if (item.item_type === 'one_and_done') {
            item.goal_value = 'true';
        }

        return item;
    }

    /**
     * Massages the item array returned from the backend for easy handling by the frontend
     * @param {Array} itemArray The array to be massaged
     */
    massageItems(itemArray) {
        this._logger.debug('Array before massaging: ' + JSON.stringify(itemArray));
        itemArray.forEach(item => {
            this.massageItem(item);
        })

        this._logger.debug('Array after massaging: ' + JSON.stringify(itemArray));
        return itemArray;
    }

    /**
     * Massages the provided item so it can be rendered by the frontend
     * @param {Object} item The item to be massaged
     */
    massageItem(item) {
        if (item.item_type === 'one_and_done') {
            item.current_value = (item.current_value === 'true');
        }

        let goal_date = moment().endOf('year');
        if (item.goal_date !== '') {
            goal_date = this._dateHelper.massageDateForFrontend(item.goal_date);
        }
        this._logger.debug('Date: ' + goal_date);
        item.display_goal_date = this._dateHelper.createDisplayDate(goal_date);
        let duration = moment.duration(goal_date.diff(moment()));
        item.days_left = Math.floor(duration.asDays());
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

    /**
     * Massages the item to be passed back to the backend to be stored
     * @param {Object} itemToMassage The item to be massaged
     */
    massageItemForBackend(itemToMassage) {
        this._logger.debug('Item before the massage: ' + JSON.stringify(itemToMassage));

        if (itemToMassage.goal_date) {
            itemToMassage.goal_date = this._dateHelper.massageDateForBackend(itemToMassage.goal_date);
        }

        if (itemToMassage.item_type === 'one_and_done') {
            // for one and done's we need to turn the boolean back into a string
            itemToMassage.current_value = '' + itemToMassage.current_value;
        }

        this._logger.debug('Item after the massage: ' + JSON.stringify(itemToMassage));

        return itemToMassage;
    }
}

export default ItemHelper;