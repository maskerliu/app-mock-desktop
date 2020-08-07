import axios from "axios";
import {
  Avatar, Button, Checkbox, CheckboxGroup, Col, Dialog, Form, FormItem, Input, Loading, Option,
  Menu, MenuItem, Popover, Radio, RadioGroup, RadioButton, Row, Select, Switch, Table, TableColumn, Tag, Tooltip
} from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Vue from "vue";
// @ts-ignore
import App from "./App";
import router from "./router";
import store from "./store";

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.use(Avatar);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
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
Vue.use(Option);

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: "<App/>",
}).$mount("#app");
