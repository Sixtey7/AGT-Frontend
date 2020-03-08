import DateHelper from './DateHelper';
const uuid4 = require('uuid/v4');

/**
 * Class used to facilitate working with events within the frontend
 */
class EventHelper {
    _logger;
    _dateHelper;

    constructor(logger) {
        this._logger = logger;
        this._dateHelper = new DateHelper(logger);
    }

    /**
     * Massages the event array returned from the backend for easy handling by the frontend
     * @param {Array} eventArray The array of events to be massaged 
     */
    massageEvents(eventArray) {
        this._logger.debug('Event array before massaging: ' + JSON.stringify(eventArray));

        eventArray.forEach(event => {
            event.date = this._dateHelper.massageDateForFrontend(event.date);
        });

        // WARNING GARBAGE follows this
        let that = this;
        that._logger.debug('about to sort!');
        eventArray.sort((event1, event2) => {
            that._logger.debug('Comparing ' + event1.date + ' to ' + event2.date);
            return event1.date > event2.date;
        });

        // END GARBAGE

        this._logger.debug('Event array after massaging: ' + JSON.stringify(eventArray));
        return eventArray;
    }


    /**
     * Builds and returns an event based on the provided parameters.  Assigns a random UUID for the id
     * @param {String} input_item_id String containing the UUID of the parent item
     * @param {String} input_date String containing the date for the event
     */
    buildEvent(input_item_id, input_date) {
        let fullDate = this._dateHelper.createDateFromDisplayDate(input_date);
        this._logger.debug('Built the date: ' + fullDate);
        let new_event = {
            id: uuid4(),
            item_id: input_item_id,
            date: fullDate,
            value: 'True'
        };

        return new_event;
    }
}

export default EventHelper;