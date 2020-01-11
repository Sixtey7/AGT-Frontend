<script>
    export default {
        name: 'NewItemModal',
        props: ['show', 'itemToModify'],
        data: function() {
            return {
                item: {},
                itemTypes: [
                    { display: 'One and Done', value: 'one_and_done'},
                    { display: 'Tracked Positive', value: 'tracked_positive'}
                ]

            }
        },
        methods: {
            close() {
                this.clearValues();
                this.$emit('close');
            },
            save() {
                // deep copy the item prior to emitting it
                this.$emit('save', JSON.parse(JSON.stringify(this.item)));
                this.clearValues();
            },
            clearValues() {
                this.item.name = '';
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
                                    v-model="item.type"
                                    :items="items"
                                    item-text="display"
                                    item-value="value"
                                    label="Type"
                                    single-line
                                ></v-select>
                            </v-flex>
                        </v-layout>
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