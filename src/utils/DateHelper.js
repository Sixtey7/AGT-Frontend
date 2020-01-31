import moment from 'moment';

/**
 * Helper class used for handling date objects
 */
class DateHelper {
    _logger

    constructor(logger) {
        this._logger = logger;
    }

    /**
     * Takes in a date from the backend and returns a javascript date object
     * @param {String} dateToMassage The date to be massaged in backend format
     */
    massageDateForFrontend(dateToMassage) {
        return moment(dateToMassage.slice(0, -4), 'ddd, DD MMM YYYY HH:mm:ss');
    }

    /**
     * Returns a string representation of the date for display to a user
     * @param {Object} dateObj Javascript date object 
     */
    createDisplayDate(dateObj) {
        return dateObj.format('MMM DD, YYYY');
    }
}

export default DateHelper;