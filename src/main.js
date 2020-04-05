import Vue from 'vue'
import App from './App.vue'
import VueLogger from 'vuejs-logger'
import vuetify from '@/plugins/vuetify' // path to vuetify export
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader

Vue.config.productionTip = false

const isProduction = process.env.NODE_ENV === 'production';
const options = {
    isEnabled: true,
    logLevel : isProduction ? 'error' : 'debug',
    stringifyArguements: false,
    showLogLevel: true,
    showMethodName: true,
    separator: '|',
    showConsoleColors: true
};

// eslint-disable-next-line no-console
console.log('the current value is: ' + process.env.VUE_APP_BACKEND_HOSTNAME + ':' + process.env.VUE_APP_BACKEND_PORT);

Vue.use(VueLogger, options);

new Vue({
    vuetify,
    render: h => h(App)
}).$mount('#app')