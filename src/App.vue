<template>
    <v-app dark style = "margin-top: 0px">
        <v-card height="100%">
            <v-content>
                <v-container>
                    <ListView
                        :categoryModel = "categoryModel"
                        :categoryArray = "categoryModel.categoryArray"
                        :itemModel = "itemModel"
                        :itemArray = "itemModel.itemArray"
                        :eventModel = "eventModel"
                        :logger = "logger"
                        :backendHost = "backendHost"
                        @updatedItem = "itemUpdated">
                    </ListView>
                </v-container>
            </v-content>
        </v-card>   
    </v-app>
</template>
<script>
import CategoryModel from './model/CategoryModel';
import ItemModel from './model/ItemModel';
import EventModel from './model/EventModel';
import ListView from './components/list/ListView';
import Vue from 'vue';

export default {
    name: 'app',
    components: {
        ListView
    },
    data() {
        return {
            logger: Vue.$log,
            itemModel: new ItemModel(Vue.$log, this.backendHost),
            categoryModel: new CategoryModel(Vue.$log, this.backendHost),
            eventModel: new EventModel(Vue.$log, this.backendHost)
        }
    },
    beforeCreate() {
        this.backendHost = process.env.VUE_APP_BACKEND_HOSTNAME + ':' + process.env.VUE_APP_BACKEND_PORT;
    },
    methods: {
        itemUpdated(updatedItem) {
            this.logger.debug('top level got an updated item: ' + JSON.stringify(updatedItem));
            this.itemModel.saveItem(updatedItem);
        }
    }
}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
