<template>
    <v-list-item>
        <v-list-item-action>
            <v-checkbox
                v-model="item.current_value"
                color="primary"
                @change="one_and_done_toggle()"
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
        item: Object,
        logger: Object
    },
    methods: {
        one_and_done_toggle: function() {
            this.logger.debug('item is currently: ' + JSON.stringify(this.item));
            this.$emit('changed', this.item);
        }
    }
}
</script>