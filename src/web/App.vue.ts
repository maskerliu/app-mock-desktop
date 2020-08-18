import QrcodeVue from "qrcode.vue";
import { Component, Vue } from "vue-property-decorator";
import { Action, Mutation, State } from "vuex-class";


@Component({
    name: "App",
    components: {
        QrcodeVue
    },
})
export default class App extends Vue {

    @State((state) => state.Common.registerUrl)
    registerUrl: string;
    @State((state) => state.Common.navBarConfig)
    navBarConfig: any;
    @State((state) => state.Common.showQrCodeDialog)
    showQrCodeDialog: boolean;

    @Action("init")
    init: Function;

    @Action("unInit")
    unInit: Function;

    @Mutation("updateShowQrCodeDialog")
    updateShowQrCodeDialog: Function;

    navMenus: Array<{ path: string, tip: string, icon: string }> = [
        { path: "Proxy", tip: "代理", icon: "icon-mock" },
        { path: "MockRuleMgr", tip: "Mock规则管理", icon: "icon-rule" },
        { path: "Demo", tip: "实验室", icon: "icon-lab" }
    ];

    curPage: string = null;
    curActivedNavMenuIdx: string = null;

    created() {
        this.init();
    }

    mounted() {
        // window.onbeforeunload =  (e)=> {
        //     this.unInit();
        //     return "浏览器关闭！";
        // };
        // window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
    }

    destroyed() {
        this.unInit();
    }

    beforeunloadHandler(e: any) {
        this.unInit();
    }

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

    onNavTabClick(index: string) {
        this.curActivedNavMenuIdx = index;
        if (index === this.curPage) return;
        this.curPage = index;
        this.$router.replace({ name: index });
    }
}