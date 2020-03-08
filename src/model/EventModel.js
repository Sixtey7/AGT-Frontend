import axios from 'axios';
import ArrayHelper from '../utils/ArrayHelper';
import EventHelper from '../utils/EventHelper';
import DateHelper from '../utils/DateHelper';

// URL to find the backend event service at
const EVENT_URL = 'http://localhost:5000/events/';

/**
 * Model class used to store the event array and communicate with the backend
 */
class EventModel {
    eventArray;
    _arrayHelper;
    _eventHelper;
    _dateHelper;
    _logger;

    /**
     * Builds a clean instanceof the event model
     * Queries the backend for all of the events
     * @param {Object} logger The logger instance to be used 
     */
    constructor(logger) {
        this._logger = logger;
        this._logger.debug('Standing up the Event Model!');
        this.eventArray = new Array();
        this._arrayHelper = new ArrayHelper(logger);
        this._eventHelper = new EventHelper(logger);
        this._dateHelper = new DateHelper(logger);

        //TODO: Need to figure out if it makes sense to do the get here, since ItemModel has all of the data
        axios
            .get(EVENT_URL)
            .then(response => {
                this._logger.debug('Got the response: ' + JSON.stringify(response.data));

                this.eventArray = this._eventHelper.massageEvents(response.data);
            });
    }

    /**
     * Saves the provided new event to the collection and sends it to the backend
     * @param {Event} eventToAdd The new event to be saved to the backend
     */
    async addEvent(eventToAdd) {
        // deep copy the event prior to manpulating it
        let eventToSave = JSON.parse(JSON.stringify(eventToAdd));
        //eventToSave.date = this._dateHelper.createISOString(eventToSave.date);
/*
        let dateToSave = this._dateHelper.createISOString(eventToSave.date);
        this._logger.debug('got the date iso format: ' + dateToSave);
        dateToSave = dateToSave.substr(0, dateToSave.indexOf('T'));
        this._logger.debug('Now have the date iso string: ' + dateToSave);
        eventToSave.date = dateToSave;*/
        let dateString = this._dateHelper.createISODateString(eventToSave.date);
        this._logger.debug('built the date string: ' + dateString);
        eventToSave.date = dateString;
        // end garbage temp code
        this._logger.debug('adding a new event!: ' + JSON.stringify(eventToSave));

        let returnValue = await this._postEvent(eventToSave);

        if (returnValue) {
            eventToSave.id = returnValue.id;
            this.eventArray.push(eventToSave);
        }
        else {
            this._logger.error('failed to post event for: ' + JSON.stringify(eventToSave));
            throw "Failed to Save New Event!";
        }
    }

    /**
     * Saves the provided updated event to the collection and sends it to the backend
     * @param {Event} eventToSaveInput The Event to be saved to the backend 
     */
    async saveEditedEvent(eventToSaveInput) {
        // deep copy the evet prior to manupulating it
        let eventToSave = JSON.parse(JSON.stringify(eventToSaveInput));

        // determine if this is an existing event or a new one
        this._logger.debug('saving an edited event: ' + JSON.stringify(eventToSave));

        let returnValue = await this._putEvent(eventToSave);

        if (returnValue) {
            this._logger.debug('successfully put the event!');
        }
        else {
            this._logger.error('failed to put the event!');
            throw "Failed to Save Editied Event!";
        }
    }

    /**
     * Removes the event with the provided id from the maintained collection and removes it from the backend
     * @param {String} idToDelete the id of the event to be deleted 
     */
    async deleteEvent(idToDelete) {
        this._logger.debug('Deleting an event with id: ' + idToDelete);

        let returnValue = await this._deleteEvent(idToDelete);

        if (returnValue) {
            this.eventArray = this._arrayHelper.removeItemFromArray(idToDelete, this.eventArray);
        }
        else {
            this._logger.error('failed to delete event with id: ' + idToDelete);
            throw "Failed to Delete Event!";
        }
    }

    /**
     * Helper method used to call the put endpoint on the backend
     * @param {Event} eventToPut the event to be sent to the backend
     * @private 
     */
    async _putEvent(eventToPut) {
        let eventJSON = JSON.stringify(eventToPut);

        let returnValue = '';
        await axios({
            method: 'put',
            url: EVENT_URL + eventToPut.id,
            headers: {
                'Content-type': 'application/json'
            },
            data:
                eventJSON
        })
        .then(response => {
            this._logger.debug('got the response from the put: ' + JSON.stringify(response.data));
            returnValue = response.data;
        })
        .catch(err => {
            this._logger.error('got an error attempting the put: ' + err);
        });

        return returnValue;
    }

    /**
     * Helper method used to call the post endpoint on the backend
     * @param {Event} eventToPost the event to be sent to the backend
     * @private 
     */
    async _postEvent(eventToPost) {
        // need to delete the empty id to prevent the backend from being confused
        delete eventToPost.id;
        let eventJSON = JSON.stringify(eventToPost);

        let returnValue = '';
        await axios({
            method: 'post',
            url: EVENT_URL,
            headers: {
                'Content-Type': 'application/json'
            },
            data:
                eventJSON
        })
        .then(response => {
            if (response.status === 200) {
                this._logger.debug('Successfully posted the event!');
                returnValue = response.data;
            }
            else {
                this._logger.error('Got a negative status from the event post: ' + response.status);
            }
        })
        .catch(err => {
            this._logger.error('got an error attempting to post the event: ' + err);
        });

        return returnValue;
    }

    /**
     * Helper method used to call the delete endpoint on the backend
     * @param {String} idToDelete string holding the UUID to be sent to the backend 
     * @private
     */
    async _deleteEvent(idToDelete) {
        this._logger.debug('Deleting an event with id: ' + idToDelete);


        let returnValue = false;

        await axios({
            method: 'DELETE',
            url: EVENT_URL + idToDelete
        })
        .then(response => {
            if (response.status === 200) {
                returnValue = true;
            }
            else {
                this._logger.error('failed to delete an event with id: ' + idToDelete);
            }
        })
        .catch(err => {
            this._logger.error('got an error attempting to delete an event: ' + err);
        })

        return returnValue;
    }
}

export default EventModel;