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

                <v-list-item
                    v-for="item in itemMap[category.id]"
                    :key = "item.id">
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
        one_and_done_toggle: function(itemIdClicked) {
            this.logger.debug('item is currently: ' + JSON.stringify(this.itemArray.find(item => item.id === itemIdClicked)));
            // TODO: Need to emit the value here so the parent can handle it and tell the backend
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