import moment from 'moment';

class DateHelper {
    _logger

    constructor(logger) {
        this._logger = logger;
    }

    massageDateForFrontend(dateToMassage) {
        return moment(dateToMassage.slice(0, -4), 'ddd, DD MMM YYYY HH:mm:ss');
    }

    createDisplayDate(dateObj) {
        return dateObj.format('MMM DD, YYYY');
    }
}

export default DateHelper;