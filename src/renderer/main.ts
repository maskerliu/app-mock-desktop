import Vue from 'vue'
import axios from 'axios'
import router from './router'
import store from './store'
import VueNativeSocket from 'vue-native-websocket'
import 'swiper/dist/css/swiper.css'

import "reflect-metadata"

// @ts-ignore
import App from './App'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.prototype.$http = axios;
Vue.config.productionTip = false;


import './assets/iconfont/iconfont.css'
import 'animate.css/animate.min.css'
import 'normalize.css/normalize.css'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

const SocketConfig = {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
    format: 'json'
};

Vue.use(VueNativeSocket, 'ws://localhost:8889', SocketConfig);

/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store,
    template: '<App/>'
}).$mount('#app');
