import QrcodeVue from "qrcode.vue";
import { Component, Watch, Vue } from "vue-property-decorator";
import { Action, Mutation, State } from "vuex-class";


@Component({
    name: "App",
    components: {
        QrcodeVue
    },
})
export default class App extends Vue {

    @State((state) => state.Common.registerUrl)
    public registerUrl: string;
    @State((state) => state.Common.navBarConfig)
    public navBarConfig: any;
    @State((state) => state.Common.showQrCodeDialog)
    public showQrCodeDialog: boolean;

    @Action("init")
    private init: Function;


    @Mutation("updateShowQrCodeDialog")
    private updateShowQrCodeDialog: Function;

    private curPage: string = null;

    private navMenu: Array<string> = ["Proxy", "MockRuleMgr",];
    private curActivedNavMenuIdx: string = null;

    created() {
        this.init();
    }

    destroyed() {

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

    onShowQrCode() {
        this.updateShowQrCodeDialog(true);
    }
}