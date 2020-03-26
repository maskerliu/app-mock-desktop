import { Component, Vue, Watch } from "vue-property-decorator"
import { Action, Mutation, namespace, State, Getter } from "vuex-class"

import { ipcRenderer } from "electron"
import QrcodeVue from "qrcode.vue"

import AbstractPage from "./AbstractPage.vue"
import DebugPanel from "./DebugPanel.vue"

@Component({
    name: "BizMain",
    components: {
        QrcodeVue,
        DebugPanel,
    }
})
export default class BizMain extends AbstractPage {

    @State(state => state.Common.registerUrl)
    private registerUrl: string;
    @State(state => state.Common.navBarConfig)
    private navBarConfig: any;

    showQrCodeDialog: boolean = false;
    canRender: boolean = false;
    curPage: string = null;

    navMenu: Array<string> = ["Proxy", "MockRuleMgr", "Settings"]
    curActivedNavMenuIdx: string = null;

    created() {

    }

    mounted() {
        this.onNavTabClick(this.navMenu[0]);
    }

    destroy() {

    }

    leftNavBarItemClick() {
        let navBarConfig = this.navBarConfig;
        if (!!navBarConfig.leftCallback) {
            navBarConfig.leftCallback()
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

    @Watch("$route")
    onRouteChanged(to: any, from: any) {
        if (to.meta.index > from.meta.index) {
            
        } else if (to.meta.index < from.meta.index) {
           
        } else {
            
        }
        this.updateNavBarConfig({ title: "加载中..." });
    }

    @Watch("$store.state.Common.showQrCodeDialog")
    onShowQrCodeDialogChagned() {
        this.showQrCodeDialog = this.$store.state.Common.showQrCodeDialog;
    }

    click2Reg() {

    }
}