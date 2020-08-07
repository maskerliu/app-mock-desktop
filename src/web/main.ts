import "element-ui/lib/theme-chalk/index.css";
import Vue from "vue";

import { Checkbox, CheckboxGroup, Loading, Input, Row, Col, Menu, MenuItem, Button, Dialog, Table, TableColumn, Switch, Select, Popover, Tooltip, Form, FormItem, Tag } from "element-ui"
// @ts-ignore
import App from "./App";
import router from "./router";
import store from "./store";


Vue.config.productionTip = false;

Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Row);
Vue.use(Col);
Vue.use(Dialog);
Vue.use(Loading);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Popover);
Vue.use(Tooltip);
Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tag);

new Vue({
  components: { App },
  router,
  store,
  template: "<App/>",
}).$mount("#app");