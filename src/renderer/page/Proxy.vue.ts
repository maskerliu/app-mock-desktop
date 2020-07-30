import { ipcRenderer, webFrame } from "electron"
import { Component, Watch } from "vue-property-decorator"
import VueDragResize from 'vue-drag-resize'
import VirtualList from "vue-virtual-scroll-list"
import { namespace } from "vuex-class"
import {
  CMDCode,
  ProxyRequestRecord,
  ProxyStatRecord
} from "../../model/DataModels"
import AbstractPage from "./AbstractPage.vue"
import ProxyRecordSnap from "../../common/components/ProxyRecordSnap.vue"
import ProxyRequestDetail from "../../common/components/ProxyRequestDetail.vue"
import ProxyStatDetail from "../../common/components/ProxyStatDetail.vue"

const ProxyRecords = namespace("ProxyRecords");

@Component({
  name: "Proxy",
  components: {
    VirtualList,
    ProxyRequestDetail,
    ProxyStatDetail,
    VueDragResize,
  },
})
export default class Proxy extends AbstractPage {

  public proxyRecordSnap: any = ProxyRecordSnap;

  @ProxyRecords.State("records")
  private records: Array<ProxyRequestRecord | ProxyStatRecord>;

  @ProxyRecords.State("curRecord")
  private curRecord: ProxyRequestRecord | ProxyStatRecord;

  @ProxyRecords.Mutation("setProxyTypes")
  private setProxyTypes: Function;

  @ProxyRecords.Mutation("setCurRecord")
  private setCurRecord!: Function;

  @ProxyRecords.Mutation("clearRecords")
  private clearRecords!: Function;

  snapWidth: number = 324;

  public $refs!: {
    wrapper: any;
    bottom: any;
  };

  filterTypes: string[] = [String(CMDCode.REQUEST)];
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
    this.setProxyTypes(this.filterTypes);
    this.filtedRecords = this.records;
  }

  destroyed() {
    // this.clearProxyRecrods();
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

        if (item.type == CMDCode.REQUEST_START || item.type == CMDCode.REQUEST_END) {
          if (this.filterInput == null) return true;
          return (<ProxyRequestRecord>item).url.indexOf(this.filterInput) !== -1;
        } else {
          return true;
        }
      }
    );
  }

  public resize(newRect: { width: number, height: number, top: number, left: number }) {
    this.snapWidth = newRect.width;
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

  @Watch("filterTypes")
  private onProxyTypesChanged(): void {
    this.setProxyTypes(this.filterTypes);
  }
}
