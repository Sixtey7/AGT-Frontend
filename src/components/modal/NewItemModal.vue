<script>
    /**
     * Vue component used to present a modal form to add a new item
     * @vue-prop {boolean} show - whether or not the form should be shown
     * @vue-prop {Object} item - The item that should be shown for the form (used when editing)
     * @vue-event {null} close - Emitted when the user closes the form without saving
     * @vue-event {Object} save - Emitted when the user presses save, contains a deep copy of the result
     */
    export default {
        name: 'NewItemModal',
        props: ['show', 'itemToModify'],
        data: function() {
            return {
                item: {},
                itemTypes: [
                    { display: 'One and Done', value: 'one_and_done'},
                    { display: 'Tracked Positive', value: 'tracked_positive'}
                ],
                current_type: 'one_and_done'

            }
        },
        methods: {
            /**
             * Called when the user selects to close the form
             */
            close() {
                this.clearValues();
                this.$emit('close');
            },
            /**
             * Called when the user selects to save the item
             */
            save() {
                // deep copy the item prior to emitting it
                this.item.item_type = this.current_type;
                this.$emit('save', JSON.parse(JSON.stringify(this.item)));
                this.clearValues();
            },
            /**
             * Utility method used to clear all values in the open form
             */
            clearValues() {
                this.item.name = '';
                // default the item back to one_and_done
                this.item.item_type = 'one_and_done';
                this.current_type = 'one_and_done';
            }
        },
        watch: {
            show: function(show) {
                if (show) {
                    // need to set the values of the model if they were provided
                    if (this.itemToModify) {
                        this.item = JSON.parse(JSON.stringify(this.itemToModify));
                    }
                    else {
                        this.clearValues();
                    }
                }
            }
        }
    }
</script>
<template>
    <v-layout row justify-center>
        <v-dialog v-model="show" max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">New Item</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 md>
                                <v-text-field
                                    label="Name"
                                    v-model="item.name"
                                    required>
                                </v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout wrap>
                            <v-flex xs12 md>
                                <v-select
                                    v-model="current_type"
                                    :items="itemTypes"
                                    item-text="display"
                                    item-value="value"
                                    label="Type"
                                    single-line
                                ></v-select>
                            </v-flex>
                        </v-layout>
                        <div v-if="current_type=='one_and_done'">
                            One and done items here!
                        </div>
                        <div v-if="current_type=='tracked_positive'">
                            Tracked Positive Goes here!
                        </div>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color = "blue-darken-1" text @click="close()">Close</v-btn>
                    <v-btn color = "blue-darken-1" text @click="save()">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>
<style>
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