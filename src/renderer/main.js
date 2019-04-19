import Vue from 'vue'
import VueCookies from 'vue-cookies'
import axios from 'axios'

import VueNativeSocket from 'vue-native-websocket'

import App from './App'
import router from './router'
import store from './store'

import MuseUI from 'muse-ui'
import MuseUILoading from 'muse-ui-loading'
import NProgress from 'muse-ui-progress'

import './assets/material/material-icons.css'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui-loading/dist/muse-ui-loading.css'
import 'muse-ui-progress/dist/muse-ui-progress.css'

import TreeView from "vue-json-tree-view"
Vue.use(TreeView);

import './assets/jsoneditor/jsoneditor.min.css'
// import 'vue-jsoneditor/dist/lib/vjsoneditor.min.css'
import VJsoneditor from 'vue-jsoneditor'
Vue.use(VJsoneditor);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

const LoadingConfig = {
    overlayColor: 'hsla(0,80%,0%,.6)',        // 背景色
    size: 38,
    color: 'primary',                           // color
    className: ''
};

Vue.use(MuseUI);
Vue.use(MuseUILoading, LoadingConfig);
Vue.use(NProgress);
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

