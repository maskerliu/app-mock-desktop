import { webFrame } from "electron";
import { Component } from "vue-property-decorator";
import { Mutation } from "vuex-class";
import BaseProxy from "../../common/page/BaseProxy.vue";


@Component({
  name: "Proxy",
  components: {
  },
})
export default class Proxy extends BaseProxy {

  @Mutation("updateNavBarConfig")
  protected updateNavBarConfig: Function;

  created() {
    this.updateNavBarConfig({
      title: "代理",
      leftItem: false,
      rightItem: false,
    });
  }

  destroyed() {
    // this.clearProxyRecrods();
  }

  clearProxyRecrods(): void {
    super.clearProxyRecrods();
    webFrame.clearCache();
  }

}
