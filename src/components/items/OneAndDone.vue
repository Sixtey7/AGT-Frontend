<template>
    <v-list-item>
        <v-list-item-action>
            <v-checkbox
                v-model="item.current_value"
                color="primary"
                @change="one_and_done_toggle(item.id)"
            ></v-checkbox>
        </v-list-item-action>
        <v-list-item-content v-text="item.name">
        </v-list-item-content>
    </v-list-item>
</template>
<script>
export default {
    name: "OneAndDone",
    props: {
        item: Object
    },
    methods: {
        one_and_done_toggle: function(itemIdClicked) {
            this.logger.debug('item is currently: ' + JSON.stringify(this.itemArray.find(item => item.id === itemIdClicked)));
            // TODO: Need to emit the value here so the parent can handle it and tell the backend
        }
    }
}
</script>