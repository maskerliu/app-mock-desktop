import { Component, Vue, Watch } from "vue-property-decorator"
import { Action, Mutation, namespace, State } from 'vuex-class'

import QrcodeVue from 'qrcode.vue'
import { ipcRenderer } from 'electron'

import DebugPanel from "./DebugPanel.vue"

@Component({
    name: 'BizMain',
    components: {
        QrcodeVue,
        DebugPanel,
    }
})
export default class BizMain extends Vue {

    @Action('updateNavBarConfig') updateNavBarConfig: any;

    @State(state => state.Common.navBarConfig) navBarConfig: any;

    canRender: boolean = false;
    transitionEnterName: string = "animated fadeIn";
    transitionLeaveName: string = "animated fadeOut";
    curPage: string = null;
    showLoading: boolean = false;
    searchKey: string = null;
    logged: boolean = false;
    registerUrl: string = "padding-left: 25px;padding-left: 25px;";

    showIPSetting: boolean = false;

    created() {

    }

    mounted() {

        ipcRenderer.on('open-ip-setting', () => {
            this.showIPSetting = true;
        });
        ipcRenderer.on('get-local-server-reply', this.onGetLocalServer);

        ipcRenderer.send('get-local-server');
    }

    destroy() {
        ipcRenderer.removeAllListeners('open-ip-setting');
        ipcRenderer.removeAllListeners('open-port-setting');
        ipcRenderer.removeAllListeners('get-local-server-reply');
        ipcRenderer.removeAllListeners('update-check');
        ipcRenderer.removeAllListeners('update-available');
        ipcRenderer.removeAllListeners('update-not-available');
        ipcRenderer.removeAllListeners('download-progress');
        ipcRenderer.removeAllListeners('update-now');
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

    onNavTabClick(path: string) {
        if (path === this.curPage) return;
        this.curPage = path;
        this.showLoading = true;
        this.$router.replace({ name: path });
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
        this.updateNavBarConfig({ title: "加载中..." })
        this.showLoading = true;
    }

    onGetLocalServer(event: any, resp: any) {
        console.log(this.$options);
        // this.$options.sockets.onmessage = (stream) => {
        //     this.handleMsg(stream.data);
        // };
    }

    handleMsg(data: any) {

    }

    click2Reg() {

    }
}