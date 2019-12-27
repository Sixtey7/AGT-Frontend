<template>
      <v-card
        max-width="600"
        class="mx-auto">
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
                        @click="toggle"
                    ></v-checkbox>
                </v-list-item-action>
                <v-list-item-content v-text="item1Title">
                </v-list-item-content>
            </v-list-item>

            <v-list-item>
                <v-list-item-action>
                    <v-checkbox
                        v-model="checked"
                        color="primary"
                        @click="toggle"
                    ></v-checkbox>
                </v-list-item-action>
                <v-list-item-content v-text="item2Title">
                </v-list-item-content>
            </v-list-item>

            <v-list-item>
                <v-list-item-action>
                    <v-checkbox
                        v-model="checked"
                        color="primary"
                        @click="toggle"
                    ></v-checkbox>
                </v-list-item-action>                
                <v-list-item-content v-text="item3Title">
                </v-list-item-content>
            </v-list-item>

            </v-list-group>
        </div>
      </v-card>
</template>
<script>
import CategoryModel from '../../model/CategoryModel';
import ItemHelper from '../../utils/ItemHelper';

export default {
    name: 'ListView',
    components: {
    },
    data() {
        return {
            checked: false,
            item1Title: 'Item 1',
            item2Title: 'Item 2',
            item3Title: 'Item 3',
            itemHelper: new ItemHelper(this.logger),
            itemMap: new Map()

        }
    },
    props: {
        logger: Object,
        categoryModel: CategoryModel,
        categoryArray: Array,
        itemArray: Array
    },
    methods: {
        toggle() {
            // eslint-disable-next-line
            this.logger.debug("Oh, I've been clicked!");
        }
    },
    watch: {
        itemArray: function(val) {
            this.logger.debug('Item array changed, new length is: ' + val.length);
            this.itemMap = this.itemHelper.createMapByCategory(val);
            this.logger.debug('Got the built map: ' + JSON.stringify(this.itemMap));
        }
    }

}
</script>