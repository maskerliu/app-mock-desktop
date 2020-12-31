import { webFrame } from "electron";
import { Component, Vue } from "vue-property-decorator";
import { Mutation } from "vuex-class";
import BaseProxy from "../../common/page/BaseProxy.vue";


@Component({
  name: "Proxy",
  components: {
    BaseProxy
  },
})
export default class Proxy extends Vue {

  @Mutation("updateNavBarConfig")
  protected updateNavBarConfig: Function;

  mounted() {
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
    // super.clearProxyRecrods();
    webFrame.clearCache();
  }

}
