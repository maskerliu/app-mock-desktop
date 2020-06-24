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
  private isShowQrCode: boolean;

  @State((state) => state.Common.registerUrl)
  private registerUrl: string;
  @State((state) => state.Common.navBarConfig)
  private navBarConfig: any;

  @Mutation("updateShowQrCodeDialog")
  private updateShowQrCodeDialog: Function;

  private showQrCodeDialog: boolean = false;
  private canRender: boolean = false;
  private curPage: string = null;

  navMenu: Array<string> = ["Proxy", "MockRuleMgr", "Spider", "Settings"];
  curActivedNavMenuIdx: string = null;

  created() { }

  mounted() {
    this.onNavTabClick(this.navMenu[0]);
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
    this.showQrCodeDialog = !this.showQrCodeDialog;
    this.updateShowQrCodeDialog(this.showQrCodeDialog);
  }

  @Watch("$route")
  onRouteChanged(to: any, from: any) {
    if (to.meta.index > from.meta.index) {
    } else if (to.meta.index < from.meta.index) {
    } else {
    }
    this.updateNavBarConfig({ title: "加载中..." });
  }

  @Watch("isShowQrCode")
  onShowQrCodeDialogChanged() {
    this.showQrCodeDialog = this.isShowQrCode;
    if (!this.isShowQrCode) {
      this.updateShowQrCodeDialog(null);
    }
  }

  click2Reg() { }
}
