import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Vue from "vue";
// @ts-ignore
import App from "./App";
import router from "./router";
import store from "./store";


Vue.config.productionTip = false;

Vue.use(ElementUI);

new Vue({
  components: { App },
  router,
  store,
  template: "<App/>",
}).$mount("#app");