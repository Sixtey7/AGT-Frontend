<template>
    <div id = "list-view">
        <div id = "category-item-list-div">
            <v-list-group
                v-for="category in categoryArray"
                :key = "category.id"
            >
            <template v-slot:activator>
                <v-list-item-title>{{category.name}}</v-list-item-title>
            </template>

            <v-list-item>
                <v-list-item-action>
                    <v-checkbox 
                        v-model="checked" 
                        color="primary"
                        @click = "toggle">
                    </v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>
                        Item 1
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item>
                <v-list-item-action>
                    <v-checkbox>
                    </v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>
                        Item 2
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item>
                <v-list-item-action>
                    <v-checkbox>
                    </v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>
                        Item 3
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            </v-list-group>
        </div>
    </div>
</template>
<script>
import CategoryModel from '../../model/CategoryModel';
export default {
    name: 'ListView',
    components: {
    },
    data() {
        return {
            checked: false
        }
    },
    props: {
        logger: Object,
        categoryModel: CategoryModel,
        categoryArray: Array
    },
    methods: {
        toggle() {
            // eslint-disable-next-line
            console.log("Oh, I've been clicked!");
        }
    }
}
</script>