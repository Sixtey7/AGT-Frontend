<template>
    <v-list-item two-line>
        <v-list-item-action>
            <v-text-field
                v-text="currentRatio"
                single-line/>
        </v-list-item-action>
        <v-list-item-content @click="editItem">
          <v-list-item-title v-text="item.name"></v-list-item-title>
          <v-list-item-subtitle v-if="item.display_goal_date" v-text="goalDisplay"></v-list-item-subtitle>
        </v-list-item-content>
    </v-list-item>
</template>
<script>
export default {
    name: "Tracked",
    props: {
        item: Object,
        logger: Object
    },
    methods: {
        /**
        * Called when the user clicks on the item, alerts the parent component to edit the item
        * @vue-event {Object} edit - Emits the item to be edited
        */
        editItem: function() {
         this.logger.debug('gonna edit!');
        this.$emit("edit", this.item);
        }
    },
    computed: {
        /**
            Computes the value to be displayed as the ratio
         */
        currentRatio: function() {
            return this.item.events.length + '/' + this.item.goal_value

            //return this.item.current_value + '/' + this.item.goal_value
        },
        /**
         * Computes the way to display the goal date
         */
        goalDisplay: function() {
            return this.item.display_goal_date + ' (' + this.item.days_left + ' Days Left!)';
        }
    }

}
</script>