/**
 * Class used to faciliate downloading and uploading all data
 */
import axios from 'axios';

// URL to find the export functions at
const EXPORT_URL = 'http://localhost:5000/export/';

class DataHelper {
    _logger;

    constructor(logger) {
        this._logger = logger;
    }

    /**
     * Calls the backend service to download all of the data and then returns it
     * 
     * @returns all data as a CSV from the backend
     */
    async downloadAllData() {
        let returnValue = '';
        await axios({
            method: 'get',
            url: EXPORT_URL
        })
        .then(response => {
            this._logger.debug('Got the response from the get: ' + JSON.stringify(response.data));
            if (response.status === 200) {
                this._logger.debug('successfully got the data');
                returnValue = response.data;
            }
            else {
                this._logger.error('Failed to get data with response code: ' + response.status);
            }
        })
        .catch(err => {
            this._logger.error('Got the error when attempting to get the export data: ' + err);
        })

        return returnValue;
    }
}

export default DataHelper;