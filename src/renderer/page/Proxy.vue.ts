import { Component, Vue, Watch } from "vue-property-decorator"
import { Action, namespace, Getter, Mutation } from "vuex-class"

import { ipcRenderer } from "electron"
import { Message } from "element-ui"
import BScroll from "better-scroll"

import { CMDCode, ProxyRequestRecord, ProxyStatRecord } from "../../model/DataModels"

import AbstractPage from "./AbstractPage.vue"
import ProxyRequestSnap from "./components/ProxyRequestSnap.vue"
import ProxyRequestDetail from "./components/ProxyRequestDetail.vue"
import ProxyStatSnap from "./components/ProxyStatSnap.vue"
import ProxyStatDetail from "./components/ProxyStatDetail.vue"

const ProxyRecords = namespace("ProxyRecords")

@Component({
    name: "Proxy",
    components: {
        ProxyRequestSnap,
        ProxyRequestDetail,
        ProxyStatSnap,
        ProxyStatDetail
    }
})
export default class Proxy extends AbstractPage {

    @ProxyRecords.Getter("proxyRecords")
    private records: Array<ProxyRequestRecord | ProxyStatRecord>;

    @ProxyRecords.Action("clearRecords")
    private clearRecords!: Function;


    public $refs!: {
        wrapper: any,
        bottom: any,
    };

    proxyTypes: string[] = [String(CMDCode.REQUEST)];
    mockDelay: number = null;
    isDelay: boolean = false;
    filterInput: string = null;
    activeTab: string = "0";

    throttleRecords: Array<ProxyRequestRecord | ProxyStatRecord> = null;
    filtedRecords: Array<ProxyRequestRecord | ProxyStatRecord> = null;
    curRecord: ProxyRequestRecord | ProxyStatRecord = null;
    scroll: any = null;

    mounted() {
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

    destroyed() {
        try {
            this.scroll.destroy();
            this.scroll = null;
        } catch (err) {

        }

        this.clearProxyRecrods();
    }

    public onItemClicked(item: ProxyRequestRecord | ProxyStatRecord): void {
        switch (item.type) {
            case CMDCode.REQUEST:
            case CMDCode.REQUEST_START:
            case CMDCode.REQUEST_END:
                this.curRecord = item;
                break;
            case CMDCode.STATISTICS:
                this.curRecord = item;
                console.log("ProxyStatRecord");
                break;
            default:
                Message({ message: "未知类型数据", type: "warning" });
                break;
        }
    }

    public clearProxyRecrods(): void {
        this.filtedRecords = null;
        this.curRecord = null;
        this.clearRecords();
    }

    private siftRecords(): void {
        this.filtedRecords = this.records.filter((item: ProxyRequestRecord | ProxyStatRecord) => {
            switch (item.type) {
                case CMDCode.REQUEST:
                case CMDCode.REQUEST_START:
                case CMDCode.REQUEST_END:
                    if (this.filterInput == null) return true;
                    return (<ProxyRequestRecord>item).url.indexOf(this.filterInput) !== -1;
                case CMDCode.STATISTICS:
                    return true;
                default:
                    return false;
            }
        });
    }

    @Watch("isDelay")
    private onSetDelayChanged(): void {
        if (!this.isDelay) this.mockDelay = null;
        ipcRenderer.send("set-delay", { isDelay: this.isDelay, delay: this.mockDelay });
    }

    @Watch("records")
    private onRecordsChanged(): void {
        this.siftRecords();
        setTimeout(() => {
            this.scroll && this.scroll.refresh();
            this.scroll && this.scroll.scrollToElement(this.$refs.bottom, 200);
        }, 50);
    }

    @Watch("filterInput")
    private onFilterChanged(): void {
        this.siftRecords();
    }

    @Watch("proxyTypes")
    private onProxyTypesChanged(): void {
        this.siftRecords();
    }
}
