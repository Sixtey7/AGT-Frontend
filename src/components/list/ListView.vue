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
                <div
                    v-for="item in itemMap[category.id]"
                    :key="item.id">
                    <OneAndDone
                        :item="item" 
                        :logger="logger"
                        @changed="one_and_done_toggle"/>
                </div>
                
            </v-list-group>
        </div>
      </v-card>
</template>
<script>
import CategoryModel from '../../model/CategoryModel';
import ItemHelper from '../../utils/ItemHelper';
import OneAndDone from '../items/OneAndDone';
export default {
    name: 'ListView',
    components: {
        OneAndDone
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
        one_and_done_toggle: function(updatedItem) {
            this.logger.debug('got a one and done change event: ' + JSON.stringify(updatedItem));
            this.$emit('updatedItem', updatedItem);
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