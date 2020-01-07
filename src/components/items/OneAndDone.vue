<template>
  <v-list-item two-line>
    <v-list-item-action>
      <v-checkbox
        v-model="item.current_value"
        color="primary"
        @change="one_and_done_toggle()"
      ></v-checkbox>
    </v-list-item-action>
    <v-list-item-content>
      <v-list-item-title v-text="item.name"></v-list-item-title>
      <v-list-item-subtitle v-if="item.display_goal_date" v-text="goalDisplay"></v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>
<script>
/**
 * @vue-prop {Object} item - the item being displayed in the vue
 * @vue-prop {Object} logger - The logger instance to be used
 * @vue-event {Object} changed - Emit the updated item when changed
 */
export default {
  name: "OneAndDone",
  props: {
    item: Object,
    logger: Object
  },
  methods: {
    /**
     * Called when the user clicks on the checkbox, alerts the parent component
     * @vue-event {Object} changed - Emits the updated item
     */
    one_and_done_toggle: function() {
      this.logger.debug("item is currently: " + JSON.stringify(this.item));
      this.$emit("changed", this.item);
    }
  },
  computed: {
    goalDisplay: function() {
      return this.item.display_goal_date + ' (' + this.item.days_left + ' Days Left!)';
    }
  }
};
</script>
