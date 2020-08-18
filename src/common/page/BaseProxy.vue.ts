import { Component, Vue, Watch } from "vue-property-decorator"
import VirtualList from "vue-virtual-scroll-list"
import { namespace, State } from "vuex-class"
import { PorxyType, ProxyRequestRecord, ProxyStatRecord } from "../../model/DataModels"
import { setProxyDelay } from "../../model/LocaAPIs"
import Live2d from '../components/live2d'
import ProxyRecordSnap from "../components/ProxyRecordSnap.vue"
import ProxyRequestDetail from "../components/ProxyRequestDetail.vue"
import ProxyStatDetail from "../components/ProxyStatDetail.vue"

const ProxyRecords = namespace("ProxyRecords");

@Component({
    name: "BaseProxy",
    components: {
        VirtualList,
        Live2d,
        ProxyRequestDetail,
        ProxyStatDetail,
    },
})
export default class BaseProxy extends Vue {

    @ProxyRecords.State("records")
    records: Array<ProxyRequestRecord | ProxyStatRecord>;

    @ProxyRecords.State("curRecord")
    curRecord: ProxyRequestRecord | ProxyStatRecord;

    @ProxyRecords.Mutation("setProxyTypes")
    setProxyTypes: Function;

    @ProxyRecords.Mutation("setCurRecord")
    setCurRecord!: Function;

    @ProxyRecords.Mutation("clearRecords")
    clearRecords!: Function;

    $refs!: {
        container: any;
        resizeBar: any;
        leftDom: any;
        rightDom: any;
    };

    proxyRecordSnap: any = ProxyRecordSnap;
    filterTypes: string[] = [String(PorxyType.REQUEST)];
    proxyDelay: number = null;
    isDelay: boolean = false;
    filterInput: string = null;
    activeTab: string = "0";

    throttleRecords: Array<ProxyRequestRecord | ProxyStatRecord> = null;
    filtedRecords: Array<ProxyRequestRecord | ProxyStatRecord> = [];

    scroll: any = null;
    clientStartX: number = 0;

    mounted() {
        this.setProxyTypes(this.filterTypes);
        this.filtedRecords = this.records;

        this.$refs.resizeBar.$el.onmousedown = (e: MouseEvent) => {
            this.clientStartX = e.clientX;
            document.onmousemove = (e) => {
                this.moveHandle(e.clientX);
                return false;
            };

            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
            };
            return false;
        };
    }

    destroyed() {
        // this.clearProxyRecrods();
    }

    moveHandle(nowClient: any) {
        let changeWidth = nowClient - 85;
        if (changeWidth < 300) {
            changeWidth = 300;
            nowClient = 330;
        }
        let remainWidth = this.$refs.container.$el.clientWidth - changeWidth - 20;
        this.$refs.leftDom.$el.style.width = changeWidth + "px";
        this.$refs.rightDom.$el.style.width = remainWidth + "px";
    }

    clearProxyRecrods(): void {
        this.filtedRecords = [];
        this.clearRecords();
        this.setCurRecord(null);
    }

    siftRecords(): void {
        this.filtedRecords = this.records.filter(
            (item: ProxyRequestRecord | ProxyStatRecord) => {
                if (item.type == PorxyType.REQUEST_START || item.type == PorxyType.REQUEST_END) {
                    if (this.filterInput == null) return true;
                    return (<ProxyRequestRecord>item).url.indexOf(this.filterInput) !== -1;
                } else {
                    return true;
                }
            }
        );
    }

    onSetDelayChanged(): void {
        if (!this.isDelay) this.proxyDelay = null;
        setProxyDelay(this.proxyDelay, this.isDelay).then(resp => {

        }).catch(err => {
            this.isDelay = !this.isDelay;
        });
    }

    @Watch("records")
    onRecordsChanged(): void {
        this.siftRecords();
    }

    @Watch("filterInput")
    onFilterChanged(): void {
        this.siftRecords();
    }

    @Watch("filterTypes")
    onProxyTypesChanged(): void {
        this.setProxyTypes(this.filterTypes);
    }
}
