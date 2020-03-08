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
     * Takes in a date from the fromend and returns a date formatted for the backend
     * @param {Object} dateToMassage Javascript date object
     */
    massageDateForBackend(dateToMassage) {
        return moment(dateToMassage).format('ddd, DD MMM YYYY HH:mm:ss');
    }

    /**
     * Returns the provided date into an ISO Date (YYYY-MM-DD) format
     * @param {String} dateToMassage the date to be turned into an ISO Date
     */
    createISODateString(dateToMassage) {
        return moment(dateToMassage).format('YYYY-MM-DD');
    }

    /**
     * Returns a formatted date from the provided display date
     * @param {String} displayDate The date in display date format (MM-DD-YYYY)
     */
    createDateFromDisplayDate(displayDate) {
        return moment(displayDate).format('ddd, DD MMM YYYY HH:mm:ss');
    }

    /**
     * Returns the string version of today's date
     */
    getTodayString() {
        return moment().toISOString().substr(0, 10);
    }
}

export default DateHelper;