<template>
    <v-list-item two-line>
        <v-list-item-action>
            <v-text-field
                v-text="currentRatio"
                single-line/>
        </v-list-item-action>
        <v-list-item-content>
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
    computed: {
        /**
            Computes the value to be displayed as the ratio
         */
        currentRatio: function() {
            return "5/10"
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