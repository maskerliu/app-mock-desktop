import { ipcRenderer } from "electron";
import QrcodeVue from "qrcode.vue";
import { Component, Watch } from "vue-property-decorator";
import { Mutation, State } from "vuex-class";
import AbstractPage from "./AbstractPage.vue";
import DebugPanel from "./DebugPanel.vue";

@Component({
  name: "BizMain",
  components: {
    QrcodeVue,
    DebugPanel,
  },
})
export default class BizMain extends AbstractPage {
  @State((state) => state.Common.showQrCodeDialog)
  public showQrCodeDialog: boolean;
  @State((state) => state.Common.registerUrl)
  public registerUrl: string;
  @State((state) => state.Common.navBarConfig)
  public navBarConfig: any;

  @Mutation("updateShowQrCodeDialog")
  public updateShowQrCodeDialog: Function;

  private canRender: boolean = false;
  private curPage: string = null;

  navMenus: Array<{ path: string, tip: string, icon: string }> = [
    { path: "Proxy", tip: "代理", icon: "icon-mock" },
    { path: "MockRuleMgr", tip: "Mock规则管理", icon: "icon-rule" },
    { path: "Spider", tip: "爬虫", icon: "icon-spider" },
    { path: "UpupU", tip: "实验室", icon: "icon-lab" },
    { path: "Settings", tip: "设置", icon: "icon-setting" }
];
  public curActivedNavMenuIdx: string = null;

  created() { }

  mounted() {
    this.onNavTabClick(this.navMenus[0].path);
  }

  destroy() { }

  leftNavBarItemClick() {
    let navBarConfig = this.navBarConfig;
    if (!!navBarConfig.leftCallback) {
      navBarConfig.leftCallback();
    } else {
      if (this.$router.currentRoute.meta.index > 1) {
        if (window.history.length <= 1) {
          this.$router.replace({ path: "/" });
        } else {
          this.$router.back();
        }
      }
    }
  }

  rightNavBarItemClick() {
    let navBarConfig = this.navBarConfig;
    if (!!navBarConfig.rightCallback) {
      navBarConfig.rightCallback();
    }
  }

  onNavTabClick(index: string) {
    this.curActivedNavMenuIdx = index;
    if (index === this.curPage) return;
    this.curPage = index;
    this.$router.replace({ name: index });
  }

  onMaximize() {
    ipcRenderer.send("on-app-maximize");
  }

  onMinus() {
    ipcRenderer.send("on-app-minus");
  }

  onClose() {
    ipcRenderer.send("on-app-quit");
  }

  onShowQrCode() {
    this.updateShowQrCodeDialog(true);
  }

  @Watch("$route")
  onRouteChanged(to: any, from: any) {
    if (to.meta.index > from.meta.index) {
    } else if (to.meta.index < from.meta.index) {
    } else {
    }
    this.updateNavBarConfig({ title: "加载中..." });
  } 

  click2Reg() { }
}
