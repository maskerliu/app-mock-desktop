import { Component, Vue, Watch } from "vue-property-decorator"
import { Action, Mutation, namespace, State, Getter } from 'vuex-class'

import QrcodeVue from 'qrcode.vue'
import { ipcRenderer } from 'electron'

import DebugPanel from "./DebugPanel.vue"
import { CommonState } from "../store/types"
import store from "../store"

@Component({
    name: 'BizMain',
    components: {
        QrcodeVue,
        DebugPanel,
    }
})
export default class BizMain extends Vue {

    @Action('updateNavBarConfig') updateNavBarConfig: any;

    @State(state => state.Common.registerUrl) registerUrl: string;
    @State(state => state.Common.navBarConfig) navBarConfig: any;

    showQrCodeDialog: boolean = false;
    canRender: boolean = false;
    transitionEnterName: string = "animated fadeIn";
    transitionLeaveName: string = "animated fadeOut";
    curPage: string = null;

    navMenu: Array<string> = ["Proxy", "MockRuleMgr", "Settings"]
    curActivedNavMenuIdx: string = this.navMenu[0];

    created() {

    }

    mounted() {
        
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
                    this.$router.replace({ path: '/' });
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
            this.transitionLeaveName = 'animated zoomOutDown';
        }
    }

    onNavTabClick(index: string) {
        this.curActivedNavMenuIdx = index;
        if (index === this.curPage) return;
        this.curPage = index;
        this.$router.replace({ name: index });
    }

    onClose() {
        console.log("on close");
    }

    @Watch('$route')
    onRouteChanged(to: any, from: any) {
        if (to.meta.index > from.meta.index) {
            this.transitionEnterName = 'animated bounceInRight';
            this.transitionLeaveName = 'animated fadeOut';
        } else if (to.meta.index < from.meta.index) {
            this.transitionEnterName = 'animated';
            this.transitionLeaveName = 'animated bounceOutRight';
        } else {
            this.transitionEnterName = 'animated';
            this.transitionLeaveName = 'animated fadeOut';
        }
        this.updateNavBarConfig({ title: "加载中..." });
    }

    click2Reg() {

    }
}