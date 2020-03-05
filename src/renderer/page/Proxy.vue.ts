import { Component, Vue, Watch } from "vue-property-decorator"
import { Action, namespace, Getter, Mutation } from "vuex-class"

import { Message } from "element-ui"
import BScroll from 'better-scroll'
import { throttle } from 'lodash'

import { CMDCode, ProxyRequestRecord, ProxyStatRecord } from "../model/DataModels"

import ProxyRequestSnap from "./components/ProxyRequestSnap.vue"
import ProxyRequestDetail from "./components/ProxyRequestDetail.vue"
import ProxyStatSnap from "./components/ProxyStatSnap.vue"
import ProxyStatDetail from "./components/ProxyStatDetail.vue"

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
    @Action('updateNavBarConfig')
    public updateNavBarConfig: Function;

    @ProxyRecords.Getter("proxyRecords")
    public records: Array<ProxyRequestRecord | ProxyStatRecord>;

    @ProxyRecords.Action('handleRecords')
    public handleRecords!: Function;


    public $refs!: {
        wrapper: any,
        bottom: any,
    };

    proxyTypes: string[] = [String(CMDCode.REQUEST)];
    mockDelay: number = null;
    filterInput: string = null;
    activeTab: string = "0";

    throttleRecords: Array<ProxyRequestRecord | ProxyStatRecord> = null;
    filtedRecords: Array<ProxyRequestRecord | ProxyStatRecord> = null;
    curRecord: ProxyRequestRecord | ProxyStatRecord = null;
    scroll: any = null;

    mounted() {
        this.init();
    }

    activated() {
        this.init();
    }

    destoryed() {
        if (!this.scroll) return;
        this.scroll.destroy();
        this.scroll = null;
    }

    init() {
        this.updateNavBarConfig({
            title: "代理",
            leftItem: false,
            rightItem: false,
        });
        setTimeout(() => {
            this.scroll = new BScroll(this.$refs.wrapper, {
                mouseWheel: true,
            });
        }, 1000);
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

    siftRecords() {
        this.filtedRecords = this.records.filter((item: ProxyRequestRecord | ProxyStatRecord) => {
            if (item instanceof ProxyRequestRecord && this.proxyTypes.includes(String(CMDCode.REQUEST))) {
                if (this.filterInput == null) return true;
                return (<ProxyRequestRecord>item).url.indexOf(this.filterInput) !== -1;
            } else if (item instanceof ProxyStatRecord && this.proxyTypes.includes(String(CMDCode.STATISTICS))) {
                return true;
            } else {
                return false;
            }
        });
    }

    @Watch("records")
    onRecordsChanged() {
        this.siftRecords();
        setTimeout(() => {
            this.scroll && this.scroll.refresh();
            this.scroll && this.scroll.scrollToElement(this.$refs.bottom, 200);
        }, 50);
    }

    @Watch("filterInput")
    onFilterChanged() {
        this.siftRecords();
    }

    @Watch("proxyTypes")
    onProxyTypesChanged() {
        console.log(this.proxyTypes.includes(String(CMDCode.REQUEST)));
        this.siftRecords();
    }
}
