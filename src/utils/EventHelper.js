import DateHelper from './DateHelper';

class EventHelper {
    _logger;
    _dateHelper;

    constructor(logger) {
        this._logger = logger;
        this._dateHelper = new DateHelper(logger);
    }

    massageEvents(eventArray) {
        this._logger.debug('Event array before massaging: ' + JSON.stringify(eventArray));

        eventArray.forEach(event => {
            event.date = this._dateHelper.massageDateForFrontend(event.date);
        });

        this._logger.debug('Event array after massaging: ' + JSON.stringify(eventArray));
        return eventArray;
    }
}

export default EventHelper;