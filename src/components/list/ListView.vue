<template>
  <v-card max-width="600" class="mx-auto">
    <div id="category-item-list-div">
      <v-list-group v-for="category in categoryArray" :key="category.id">
        <template v-slot:activator>
          <v-list-item-title>{{category.name}}</v-list-item-title>
        </template>
        <div v-for="item in itemMap[category.id]" :key="item.id">
          <OneAndDone v-if="item.item_type=='one_and_done'" :item="item" :logger="logger" @changed="one_and_done_toggle" />
          <Tracked v-if="item.item_type=='tracked_positive'" :item="item" :logger="logger" />
        </div>
      </v-list-group>
    </div>
  </v-card>
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
import ItemHelper from "../../utils/ItemHelper";
import OneAndDone from "../items/OneAndDone";
import Tracked from '../items/Tracked';

export default {
  name: "ListView",
  components: {
    OneAndDone,
    Tracked
  },
  data() {
    return {
      itemHelper: new ItemHelper(this.logger),
      itemMap: new Map()
    };
  },
  props: {
    logger: Object,
    categoryModel: CategoryModel,
    categoryArray: Array,
    itemArray: Array
  },
  methods: {
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