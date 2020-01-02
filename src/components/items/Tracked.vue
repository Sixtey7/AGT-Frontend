<template>
    <v-list-item>
        <v-list-item-action>
            <v-text-field
                v-text="currentRatio"
                single-line/>
        </v-list-item-action>
        <v-list-item-content v-text="item.name"></v-list-item-content>
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