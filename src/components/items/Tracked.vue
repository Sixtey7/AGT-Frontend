<template>
    <v-list-item two-line>
        <v-list-item-action>
            <v-text-field
                v-text="currentRatio"
                single-line/>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="item.name"></v-list-item-title>
          <v-list-item-subtitle v-if="item.display_goal_date" v-text="item.display_goal_date"></v-list-item-subtitle>
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
        currentRatio: function() {
            return "5/10"
        }
    }

}
</script>