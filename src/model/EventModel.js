import axios from 'axios';
import ArrayHelper from '../utils/ArrayHelper';
import EventHelper from '../utils/EventHelper';

const EVENT_URL = 'http://localhost:5000/events/';

class EventModel {
    eventArray;
    _arrayHelper;
    _eventHelper;
    _logger;

    constructor(logger) {
        this._logger = logger;
        this._logger.debug('Standing up the Event Model!');
        this.eventArray = new Array();
        this._arrayHelper = new ArrayHelper(logger);
        this._eventHelper = new EventHelper(logger);

        //TODO: Need to figure out if it makes sense to do the get here, since ItemModel has all of the data
        axios
            .get(EVENT_URL)
            .then(response => {
                this._logger.debug('Got the response: ' + JSON.stringify(response.data));

                this.eventArray = this._eventHelper.massageEvents(response.data);
            });
    }

    async saveEvent(eventToSaveInput) {
        // deep copy the evet prior to manupulating it
        let eventToSave = JSON.parse(JSON.stringify(eventToSaveInput));

        // determine if this is an existing event or a new one
        if (eventToSaveInput.id) {
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
        else {
            this._logger.debug('adding a new event!: ' + JSON.stringify(eventToSave));

            let returnValue = await this._postEvent(eventToSave);

            if (returnValue) {
                eventToSave.id = returnValue.id;
                this.eventArray.push(eventToSave);
            }
            else {
                this._logger.error('failed to post event for: ' + JSON.stringify(event));
                throw "Failed to Save New Event!";
            }
        }
    }

    async deleteEvent(idToDelete) {
        this._logger.delete('Deleting an event with id: ' + idToDelete);

        let returnValue = await this._deleteEvent(idToDelete);

        if (returnValue) {
            this.eventArray = this._arrayHelper.removeItemFromArray(idToDelete);
        }
        else {
            this._logger.error('failed to delete event with id: ' + idToDelete);
            throw "Failed to Delete Event!";
        }
    }

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

    async _deleteEvent(idToDelete) {
        this._logger.delete('Deleting an event with id: ' + idToDelete);


        let returnValue = false;

        await({
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