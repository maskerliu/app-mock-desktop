import axios from "axios"
import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
import Vue from "vue";
import VueDragResize from 'vue-drag-resize'
// @ts-ignore
import App from "./App";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

Vue.use(ElementUI);
Vue.component('vue-drag-resize', VueDragResize);

new Vue({
  components: { App },
  router,
  store,
  template: "<App/>",
}).$mount("#app");