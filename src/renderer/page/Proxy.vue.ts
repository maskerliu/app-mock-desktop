import { Component, Vue, Watch } from "vue-property-decorator"
import { Action, namespace, Getter, Mutation } from "vuex-class"

import ProxyRequestSnap from "./components/ProxyRequestSnap.vue"
import ProxyRequestDetail from "./components/ProxyRequestDetail.vue"
import ProxyStatSnap from "./components/ProxyStatSnap.vue"
import ProxyStatDetail from "./components/ProxyStatDetail.vue"
import { Message } from "element-ui"

import { CMDCode, ProxyRequestRecord, ProxyStatRecord } from "../model/DataModels"
import { stringify } from "querystring"

const loginModule = namespace('Login');
const ProxyRecords = namespace('ProxyRecords')

@Component({
    name: 'Proxy',
    components: {
        ProxyRequestSnap,
        ProxyRequestDetail,
        ProxyStatSnap,
        ProxyStatDetail
    }
})
export default class Proxy extends Vue {
    @Getter("fullName")
    public fullName!: string;

    @Action('updateNavBarConfig')
    public updateNavBarConfig: Function;

    @ProxyRecords.Getter("proxyRecords")
    public records: Array<ProxyRequestRecord | ProxyStatRecord>;

    @ProxyRecords.Action('handleRecords')
    public handleRecords!: Function;

    @loginModule.State(state => state.menulist) menulist: any;
    @loginModule.Action('saveMenuListFN') saveMenuListFN: Function;

    checkList: any[] = ["", ""];
    mockDelay: number = 0;
    filterInput: string = null;
    activeTab: string = "0";

    curRecord: ProxyRequestRecord | ProxyStatRecord = null;

    mounted() {
        this.updateNavBarConfig({
            title: "代理",
            leftItem: false,
            rightItem: false,
        });
        this.handleRecords(`{"code": ${CMDCode.REQUEST_START}}`);
        this.handleRecords(`{"code": ${CMDCode.STATISTICS}}`);
    }

    destroyed() {

    }

    onItemClicked(item: ProxyRequestRecord | ProxyStatRecord) {
        if (item instanceof ProxyRequestRecord) {
            this.curRecord = item;
        } else if (item instanceof ProxyStatRecord) {
            this.curRecord = item;
            console.log("ProxyStatRecord");
        } else {
            Message({ message: '未知类型数据', type: "warning" });
        }
    }

    @Watch("proxyRecords")
    onRecordChanged() {
        
    }
}
