import Vue from "vue";
import VueRouter, { Route } from "vue-router";
import { Store } from "vuex";

declare module "*.vue" {
  export default Vue;
}

declare module "vue/types/vue" {
  interface Vue {
    $router: VueRouter;
    $route: Route;
    $eventbus: any;
    $db: any;
    $socket: any;
    $connect: any;
    $disconnect: any;
  }
}

declare module "vue/types/vue" {
  interface Vue {
    $store: Store<any>;
  }
}
