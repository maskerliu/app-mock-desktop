import axios from "axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Vue from "vue";
import VueDragResize from 'vue-drag-resize'
// @ts-ignore
import App from "./App";
import router from "./router";
import store from "./store";

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.component('vue-drag-resize', VueDragResize);

Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: "<App/>",
}).$mount("#app");
