import Vue from 'vue'
import VueCookies from 'vue-cookies'
import axios from 'axios'

import VueNativeSocket from 'vue-native-websocket'

import App from './App'
import router from './router'
import store from './store'

import MuseUI from 'muse-ui'

import './assets/material/material-icons.css'
import 'muse-ui/dist/muse-ui.css'
import 'grapher-json-ui/dist/index.css'
import 'jsoneditor/dist/jsoneditor.min.css'


if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;


Vue.use(MuseUI);
Vue.use(VueCookies);

const SocketConfig = {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
    format: 'json'
};

Vue.use(VueNativeSocket, 'ws://localhost:8889', SocketConfig);

/* eslint-disable no-new */
new Vue({
    components: {App},
    router,
    store,
    template: '<App/>'
}).$mount('#app');

