<template>
    <v-app dark style = "margin-top: 0px">
        <v-card height="100%">
            <v-content>
                <v-container>
                    Hello World
                </v-container>
            </v-content>
        </v-card>   
    </v-app>
</template>
<script>
import CategoryModel from './model/CategoryModel';
import ItemModel from './model/ItemModel';
import Vue from 'vue';

export default {
    name: 'app',
    components: {
    },
    data() {
        return {
            logger: Vue.$log,
            itemModel: new ItemModel(Vue.$log),
            categoryModel: new CategoryModel(Vue.$log)
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
