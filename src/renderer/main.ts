import Vue from "vue"
import axios from "axios"
import router from "./router"
import store from "./store"


// @ts-ignore
import App from "./App"

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

Vue.prototype.$http = axios;
Vue.config.productionTip = false;

import "normalize.css/normalize.css"

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store,
    template: "<App/>"
}).$mount("#app");
