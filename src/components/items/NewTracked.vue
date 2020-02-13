<template>
    <v-list-group>
        <template v-slot:activator>
            <v-list-item-title>{{item.name}}</v-list-item-title>
        </template>
        <v-list-item v-for="event in item.events" :key="event.id">
            <v-list-item-content>
                <v-list-item-title v-text="event.name"></v-list-item-title>
            </v-list-item-content>
        </v-list-item>
    </v-list-group>
</template>
<script>
export default {
    name: "TrackedNew",
    props: {
        item: Object,
        logger: Object
    },
    methods: {
        
    }
}
</script>