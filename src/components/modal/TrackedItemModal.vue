<script>
import DateHelper from '../../utils/DateHelper';
import EventHelper from '../../utils/EventHelper';
import ArrayHelper from '../../utils/ArrayHelper';

export default {
    name: 'TrackedItemModal',
    props: ['show', 'trackedItem', 'logger'],
    data: function() {
        return {
            item: {},
            menu: false,
            delete_dialog: false,
            add_dialog: false,
            date_helper: new DateHelper(this.logger),
            event_helper: new EventHelper(this.logger),
            array_helper: new ArrayHelper(this.logger),
            editing_id: null,
            eventToDelete: {},
            date_selection: {},
            is_visible: this.show
            
        }
    },
    methods: {
        /**
         * Called when the user selcts to close the dialog
         * @vue-event {null} close - emits out to the parent to close the modal
         */
        close() {
            this.clearValues();
            this.$emit('close')
        },
        /**
         * Called when the user selects to save the tracked item
         * @vue-event {Object} save - emits the updated tracked item
         */
        save() {
            this.$emit('save', JSON.parse(JSON.stringify(this.item)))
            this.clearValues();
        },
        /**
         * Utility method used to clear out all of the properties of the modal
         */
        clearValues() {
            this.eventToDelete = {};
            this.date_selection = this.date_helper.getTodayString();
        },
        /**
         * Facilitates the deletion of the event when the user selects to do so
         * @prop {Object} event - the event the user selected to delete
         */
        deleteEvent(event) {
            this.logger.debug('Deleting an event with id: ' + event.id);
            this.eventToDelete = event;
            this.delete_dialog = true;
        },
        /**
         * Faciliates the editing of an event when the user selects to do so
         * @prop {String} eventId - The id of the event to be edited 
         */
        editEvent(eventId) {
            this.logger.debug('Editing an event with id: ' + eventId);
            this.editing_id = eventId;
            let eventToEdit = this.item.events.find(itemEvent => itemEvent.id == eventId);
            let dateToEdit = eventToEdit.date;
            this.logger.debug('Date from the event: ' + dateToEdit)

            dateToEdit = this.date_helper.createISODateString(dateToEdit);
            this.logger.debug('editing the date ' + dateToEdit);
            this.date_selection = dateToEdit;

            this.add_dialog = true;
        },
        /**
         * Called when the user dismisses the event deletion dialog
         */
        closeDeleteDialog() {
            this.delete_dialog = false;
            this.eventToDelete = {};
        },
        /**
         * Processes the deletion of an event once the user has choosen to
         * @prop {String} idToDelete - the id of the event to be deleted
         * @vue-event {String} delete_event - Emmitted to notify the parent that the event is being removed.  Contains a string with the UUID being removed
         */
        confirmEventDelete(idToDelete) {
            this.logger.debug("Confirmed removal of event with id: " + idToDelete);

            //remove the event from the list
            let index = this.item.events.findIndex(itemEvent => itemEvent.id === idToDelete);
            this.item.events.splice(index, 1);

            // emit an event to tell the backend to remove it
            this.$emit('delete_event', idToDelete);
            
            this.delete_dialog = false;
            this.eventToDelete = {};
        },
        /**
         * Called when the user dismisses the add dialog
         */
        closeAddDialog() {
            this.add_dialog = false;
            this.editing_id = null;
            this.date_selection = this.date_helper.getTodayString();
        },
        /**
         * Processes the addition of an event once the user has choosen to
         * @vue-event {Object} new_event - Emmitted to notify the parent that the event is being added.  Contains the new event object
         * @vue-event {Object} edit_event - Emmitted to notify the parent that the event is being edited.  Contains the edited event object
         */
        saveAddDialog() {
            let event_to_merge = null;

            if (this.editing_id) {
                event_to_merge = this.item.events.find(itemEvent => itemEvent.id == this.editing_id);
                let dateToSet = this.date_helper.createDateFromDisplayDate(this.date_selection);
                event_to_merge.date = dateToSet;
                this.logger.debug('emitting the edit event');
                this.is_visible = false;
                this.$emit('edit_event', event_to_merge);
            }
            else {
                // build out the new event
                event_to_merge = this.event_helper.buildEvent(this.item.id, this.date_selection);
                this.logger.debug('built the event: ' + JSON.stringify(event_to_merge));

                // emit the event for the parent to know to add the event
                this.logger.debug('emitting the new event');
                this.is_visible = false;
                this.$emit('new_event', event_to_merge);
            }

            // merge the event into the events array
            this.array_helper.mergeItemIntoArray(event_to_merge, this.item.events);


            // reset the values back on the dialog
            this.add_dialog = false;
            this.editing_id = null;
            this.date_selection = this.date_helper.getTodayString();
        }
    },
    watch: {
        show: function(show) {
            this.logger.debug('watcher hit with value: ' + show);
            this.is_visible = show;
            if (show) {
                this.clearValues();
                this.item = JSON.parse(JSON.stringify(this.trackedItem));
            }
            else {
                this.clearValues();
            }
        }
    },
    filters: {
        format_date: function (in_date) {
            if (in_date) {
                return in_date.substring(0, 10);
            }
        }
    }
}
</script>
<template>
<div>
    <v-dialog
        v-model = "delete_dialog"
        max-width="290"
    >
        <v-card>
            <v-card-title>Confirm Deletion</v-card-title>
            <v-card-text>
                Confirm deletion of event on<br>{{ eventToDelete.date | format_date }}
            </v-card-text>
            <v-card-actions>
                <v-btn
                    color = "red darken-1"
                    text
                    @click = "closeDeleteDialog"
                >
                    Nope
                </v-btn>

                <v-btn
                    color = "green darken-1"
                    text
                    @click = "confirmEventDelete(eventToDelete.id)"
                >
                    Yup
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog
        v-model = "add_dialog"
        max-width="400"
    >
        <v-card>
            <v-card-title>Add Event</v-card-title>
            <v-card-text>
                <v-date-picker v-model="date_selection" color = "green lighten-1"></v-date-picker>
            </v-card-text>
            <v-card-actions>
                <v-btn
                    color = "red darken-1"
                    text
                    @click = "closeAddDialog"
                >
                    Cancel
                </v-btn>

                <v-btn
                    color = "green darken-1"
                    text
                    @click = "saveAddDialog"
                >
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-layout row justify-center>
        <v-dialog v-model = "is_visible" max-width="600px">
            <v-card>
                <v-card-title>
                    <span class = "headline">{{ item.name }}</span>
                    <v-btn
                        color = "green darken-1"
                        text
                        @click="add_dialog = true;"
                    >Add
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <h3>Events</h3>
                    <v-list>
                        <v-list-item v-for="event in item.events" :key="event.id">
                            <v-list-item-content>
                                <v-list-item-title> {{ event.date | format_date }} </v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action>
                                <div>
                                    <v-btn icon @click="deleteEvent(event)">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                    <v-btn icon @click="editEvent(event.id)">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                </div>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-layout>
</div>
</template>
<style scoped>
* {
    box-sizing: border-box;
}

.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    transition: opacity .3s ease;
}

.modal-container {
    width: 300px;
    margin: 40px auto 0;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
    margin-top: 0;
    color: #42b983;
}

.modal-body {
    margin: 20px 0;
}

.text-right {
    text-align: right;
}

.form-label {
    display: block;
    margin-bottom: 1em;
}

.form-label > .form-control {
    margin-top: 0.5em;
}

.form-control {
    display: block;
    width: 100%;
    padding: 0.5em 1em;
    line-height: 1.5;
    border: 1px solid #ddd;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>