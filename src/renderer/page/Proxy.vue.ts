import { ipcRenderer, webFrame } from "electron";
import { Component, Watch } from "vue-property-decorator";
import VirtualList from "vue-virtual-scroll-list";
import { namespace, State } from "vuex-class";
import {
  CMDCode,
  ProxyRequestRecord,
  ProxyStatRecord,
} from "../../model/DataModels";
import AbstractPage from "./AbstractPage.vue";
import ProxyRequestDetail from "./components/ProxyRequestDetail.vue";
import ProxyRequestSnap from "./components/ProxyRequestSnap.vue";
import ProxyStatDetail from "./components/ProxyStatDetail.vue";
import ProxyStatSnap from "./components/ProxyStatSnap.vue";

const ProxyRecords = namespace("ProxyRecords");

@Component({
  name: "Proxy",
  components: {
    VirtualList,
    ProxyRequestDetail,
    ProxyStatSnap,
    ProxyStatDetail,
  },
})
export default class Proxy extends AbstractPage {
  private proxyRequestSnap: any = ProxyRequestSnap;

  @ProxyRecords.Getter("proxyRecords")
  private records: Array<ProxyRequestRecord | ProxyStatRecord>;

  @ProxyRecords.Mutation("setCurRecord")
  private setCurRecord!: Function;

  @ProxyRecords.Action("clearRecords")
  private clearRecords!: Function;

  @State((state) => state.ProxyRecords.curRecord)
  private curRecord: ProxyRequestRecord | ProxyStatRecord;

  public $refs!: {
    wrapper: any;
    bottom: any;
  };

  proxyTypes: string[] = [String(CMDCode.REQUEST)];
  mockDelay: number = null;
  isDelay: boolean = false;
  filterInput: string = null;
  activeTab: string = "0";

  throttleRecords: Array<ProxyRequestRecord | ProxyStatRecord> = null;
  filtedRecords: Array<ProxyRequestRecord | ProxyStatRecord> = [];

  scroll: any = null;

  mounted() {
    this.updateNavBarConfig({
      title: "代理",
      leftItem: false,
      rightItem: false,
    });
  }

  destroyed() {
    this.clearProxyRecrods();
  }

  public clearProxyRecrods(): void {
    this.filtedRecords = [];
    this.clearRecords();
    this.setCurRecord(null);
    webFrame.clearCache();
  }

  private siftRecords(): void {
    this.filtedRecords = this.records.filter(
      (item: ProxyRequestRecord | ProxyStatRecord) => {
        switch (item.type) {
          case CMDCode.REQUEST_START:
          case CMDCode.REQUEST_END:
            if (this.proxyTypes.indexOf[String(CMDCode.REQUEST)] == -1) {
              console.log(-1);
              return false;
            }
            if (this.filterInput == null) return true;
            return (
              (<ProxyRequestRecord>item).url.indexOf(this.filterInput) !== -1
            );
          case CMDCode.STATISTICS:
            return true;
          default:
            return false;
        }
      }
    );
  }

  @Watch("isDelay")
  private onSetDelayChanged(): void {
    if (!this.isDelay) this.mockDelay = null;
    ipcRenderer.send("set-proxy-delay", {
      isDelay: this.isDelay,
      delay: this.mockDelay,
    });
  }

  @Watch("records")
  private onRecordsChanged(): void {
    this.siftRecords();
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
