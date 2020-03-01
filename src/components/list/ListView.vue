<template>
  <div id = "list-view">
    <div id = "add-item-div">
      <v-btn id = "item-add-button" color = "primary" dark @click="showModal">Add
        <v-icon dark right>add</v-icon>
      </v-btn>
    </div>
    <NewItemModal
      :show = "isModalVisible"
      :itemToModify = "itemToModify"
      :categories = "categoryArray"
      @close = "closeModal"
      @save = "saveItem"
    />
    <TrackedItemModal
      :show = "isTrackedModalVisible"
      :trackedItem = "trackedItemToModify"
      :logger = "logger"
      @close = "closeTrackedModal"
      @save = "saveTrackedModal"
      @new_event = "addNewEvent"
      @delete_event = "deleteEvent"
    />
    <v-card max-width="600" class="mx-auto">
      <div id="category-item-list-div">
        <v-list-group v-for="category in categoryArray" :key="category.id">
          <template v-slot:activator>
            <v-list-item-title>{{category.name}}</v-list-item-title>
          </template>
          <div v-for="item in itemMap[category.id]" :key="item.id" class = "list-item-div">
            <OneAndDone v-if="item.item_type=='one_and_done'" :item="item" :logger="logger" @changed="one_and_done_toggle" @edit="editItem"/>
            <Tracked v-if="item.item_type=='tracked_positive'" :item="item" :logger="logger" @edit="editItem" @viewTracked="viewTrackedItem"/>
          </div>
        </v-list-group>
      </div>
    </v-card>
  </div>
</template>
<script>
/**
 * Vue component forming the top-level visual of the display
 * @vue-prop {Object} logger - the Logger to be used for the component
 * @vue-prop {Object} categoryModel - The model object for categories
 * @vue-prop {Object} categroyArray - The array of all categories 
 * @vue-prop {Array} itemArray - The array of all items
 * @vue-event {Object} updatedItem - Emit the updated item when changed

 */
import CategoryModel from "../../model/CategoryModel";
import ItemModel from '../../model/ItemModel';
import EventModel from '../../model/EventModel';
import ItemHelper from "../../utils/ItemHelper";
import NewItemModal from '../modal/NewItemModal';
import TrackedItemModal from '../modal/TrackedItemModal';
import OneAndDone from "../items/OneAndDone";
import Tracked from '../items/Tracked';

export default {
  name: "ListView",
  components: {
    NewItemModal,
    TrackedItemModal,
    OneAndDone,
    Tracked
  },
  data() {
    return {
      itemHelper: new ItemHelper(this.logger),
      itemMap: new Map(),
      isModalVisible: false,
      isTrackedModalVisible: false,
      itemToModify: null,
      trackedItemToModify: null
    };
  },
  props: {
    logger: Object,
    categoryModel: CategoryModel,
    itemModel: ItemModel,
    eventModel: EventModel,
    categoryArray: Array,
    itemArray: Array
  },
  methods: {
    /**
     * Opens the modal
     */
    showModal() {
      this.logger.debug('Opening the modal!');
      this.isModalVisible = true;
    },
    /**
     * Called to close the modal.  Hides the modal and nulls out the value
     */
    closeModal() {
      this.isModalVisible = false;
      this.itemToModify = null;
    },
    /**
     * Opens the tracked item modal
     */
    showTrackedModal() {
      this.logger.debug('Opening the tracked modal!');
      this.isTrackedModalVisible = true;

    },
    /**
     * Called to close the tracked modal.  Hides the modal and nulls out the associated value
     */
    closeTrackedModal() {
      this.logger.debug('Closing the tracked modal');
      this.isTrackedModalVisible = false;
      this.trackedItemToModify = null;
    },
    /**
     * Called to save the tracked item from the modal
     */
    saveTrackedModal(trackedItemToSave) {
      // TODO
      this.logger.debug('Got a call to save the tracked item + ' + JSON.stringify(trackedItemToSave));
      this.isTrackedModalVisible = false;
      this.trackedItemToModify = null;
    },
    /**
    * Called when the user clicks on an item.  Triggered by the 'edit' event from 
    * one of the child components
      */
    editItem(itemToEdit) {
      this.logger.debug('going to edit item: ' + JSON.stringify(itemToEdit));
      this.itemToModify = itemToEdit;
      this.isModalVisible = true;
    },
    /**
     * Called when the user selects to save a new/modified item
     * @prop {Object} itemToSave - the item to be saved (new or modified)
     */
    async saveItem(itemToSave) {
      this.isModalVisible = false;
      this.itemToModify = null;

      itemToSave = this.itemHelper.createNewItem(itemToSave);
      this.itemModel.saveItem(itemToSave);
    },
    /**
     * Called when a child component emits a changed event
     * @prop {Object} updatedItem - the item that was updated
     * @vue-event {Object} updatedItem - emits back out the received updated item to the parent component
     */
    one_and_done_toggle: function(updatedItem) {
      this.logger.debug(
        "got a one and done change event: " + JSON.stringify(updatedItem)
      );
      this.$emit("updatedItem", updatedItem);
    },
    /**
     * Called when the user selects to option to view a tracked item
     * @prop {Object} trackedItem - the item the user clicked on
     */
    viewTrackedItem: function (trackedItem) {
      this.logger.debug('Opening the tracked item modal for item: ' + trackedItem.id);
      this.trackedItemToModify = trackedItem;
      this.isTrackedModalVisible = true;
    },
    /**
     * Called in response to the tracked item modal emitting the event for a new event added
     * @prop {Object} newEvent - the event that was emitted from the tracked item
     */
    addNewEvent: function(newEvent) {
      this.logger.debug('Got a new event: ' + JSON.stringify(newEvent));
      
      this.eventModel.saveEvent(newEvent);
    },
    /**
     * Called in response to the tracked item modal emitting the event for a deleted event
     * @prop {String} idToDelete - String containing the uuid of the event to be deleted
     */
    deleteEvent: function(idToDelete) {
      this.logger.debug('Removing event with id: ' + idToDelete);

      this.eventModel.deleteEvent(idToDelete);
    }
  },
  watch: {
    itemArray: function(val) {
      this.logger.debug("Item array changed, new length is: " + val.length);
      this.itemMap = this.itemHelper.createMapByCategory(val);
      this.logger.debug("Got the built map: " + JSON.stringify(this.itemMap));
    }
  }
};
</script>
<style>
  .list-item-div {
    text-align: left;
  }
</style>
