import { ipcRenderer } from "electron"
import { Message } from "element-ui"
import { Component } from "vue-property-decorator"
import { Action, Mutation, State } from "vuex-class"
import { IP } from "../../model/DataModels"
import AbstractPage from "./AbstractPage.vue"


@Component({
  name: "Settings",
  components: {},
})
export default class Settings extends AbstractPage {
  @State((state) => state.Common.localServerConfig)
  private localServerConfig: any;

  @State((state) => state.Common.mockRuleSyncServer)
  private mockRuleSyncServer: string;

  @State((state) => state.Common.statRuleSyncServer)
  private statRuleSyncServer: string;

  @State((state) => state.Common.dataProxyServer)
  private dataProxyServer: string;

  @State((state) => state.Common.dataProxyStatus)
  private dataProxyStatus: boolean;

  @Action("saveLocalServerConfig")
  private saveLocalServerConfig: Function;

  @Mutation("updateMockRuleSyncServer")
  private updateMockRuleSyncServer: Function;

  @Mutation("updateStatRuleSyncServer")
  private updateStatRuleSyncServer: Function;

  @Mutation("updateDataProxyServer")
  private updateDataProxyServer: Function;

  private ips: Array<IP>;
  private curServerIP: string = null;
  private curProxyHttpPort: number = null;
  private curProxySocketPort: number = null;
  private curPushSocketPort: number = null;
  private srsUrl: string = null;
  private mrsUrl: string = null;
  private dpUrl: string = null;
  private dpStatus: boolean = false;
  private pbFiles: any[] = null;
  private serialPlugin: number = 3;

  public created(): void {
    this.updateNavBarConfig({
      title: "设置",
      leftItem: false,
      rightItem: false,
    });
    this.ips = this.localServerConfig.ips;
    this.curServerIP = this.localServerConfig.serverIP;
    this.curProxyHttpPort = this.localServerConfig.proxyHttpPort;
    this.curProxySocketPort = this.localServerConfig.proxySocketPort;
    this.curPushSocketPort = this.localServerConfig.pushSocketPort;
    this.pbFiles = this.localServerConfig.pbFiles;
    this.srsUrl = this.statRuleSyncServer;
    this.mrsUrl = this.mockRuleSyncServer;
    this.dpUrl = this.dataProxyServer;
    this.dpStatus = this.dataProxyStatus;
  }

  public destroyed(): void { }

  public onOpenFileDialog(): void {
    ipcRenderer.send("on-open-folder", "openFile");
  }

  public onDataProxySwitchChanged(status: boolean) {
    if (this.dpUrl != null) {
      this.updateDataProxyServer({ url: this.dpUrl, status: status });
    } else {
      Message.warning("代理数据服务地址不能为空");
      this.dataProxyStatus = !status;
    }

  }

  public onSave(): void {
    this.saveLocalServerConfig({
      serverIP: this.curServerIP,
      proxyHttpPort: this.curProxyHttpPort,
      proxySocketPort: this.curProxySocketPort,
      pushSocketPort: this.curPushSocketPort
    });
  }
}
