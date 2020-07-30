import { ipcRenderer } from "electron"
import { Message } from "element-ui"
import { Component } from "vue-property-decorator"
import { Action, Mutation, State } from "vuex-class"
import { IP } from "../../model/DataModels"
import AbstractPage from "./AbstractPage.vue"
import { isUrl } from "../../common/Utils"


@Component({
  name: "Settings",
  components: {},
})
export default class Settings extends AbstractPage {
  @State((state) => state.Common.localServerConfig)
  private localServerConfig: {
    serverIP: string;
    proxyHttpPort: number;
    proxySocketPort: number;
    pushSocketPort: number;
    ips: Array<IP>;
    pbFiles: Array<{ name: string; value: string }>;
  };

  @State((state) => state.Common.apiDefineServer)
  private apiDefineServer: string;

  @State((state) => state.Common.statRuleServer)
  private statRuleServer: string;

  @State((state) => state.Common.mockRuleServer)
  private mockRuleServer: string;

  @State((state) => state.Common.dataProxyServer)
  private dataProxyServer: string;

  @State((state) => state.Common.dataProxyStatus)
  private dataProxyStatus: boolean;

  @State((state) => state.Common.versionCheckServer)
  private versionCheckServer: string;

  @Mutation("updateLocalServerConfig")
  private updateLocalServerConfig: Function;

  @Mutation("updateApiDefineServer")
  private updateApiDefineServer: Function;

  @Mutation("updateMockRuleServer")
  private updateMockRuleServer: Function;

  @Mutation("updateStatRuleServer")
  private updateStatRuleServer: Function;

  @Mutation("updateDataProxyServer")
  private updateDataProxyServer: Function;

  @Mutation("updateVersionCheckServer")
  private updateVersionCheckServer: Function;

  private ips: Array<IP>;
  private curServerIP: string = null;
  private curProxyHttpPort: number = null;
  private curProxySocketPort: number = null;
  private curPushSocketPort: number = null;
  private adsUrl: string = null;
  private srsUrl: string = null;
  private mrsUrl: string = null;
  private dpsUrl: string = null;
  private dpStatus: boolean = false;
  private vcsUrl: string = null;
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

    this.adsUrl = this.apiDefineServer;
    this.srsUrl = this.statRuleServer;
    this.mrsUrl = this.mockRuleServer;
    this.dpsUrl = this.dataProxyServer;
    this.dpStatus = this.dataProxyStatus;
    this.vcsUrl = this.versionCheckServer;
  }

  public destroyed(): void { }

  public onOpenFileDialog(): void {
    ipcRenderer.send("on-open-folder", "openFile");
  }

  public onDataProxySwitchChanged() {
    if (isUrl(this.dpsUrl)) {
      this.updateDataProxyServer({ url: this.dpsUrl, status: this.dpStatus });
    } else {
      Message.warning("非法URL");
      this.dpStatus = !this.dpStatus;
    }
  }

  public onSave(): void {
    this.updateApiDefineServer(this.adsUrl);
    this.updateStatRuleServer(this.srsUrl);
    this.updateMockRuleServer(this.mrsUrl);
    this.updateDataProxyServer({ url: this.dpsUrl, status: this.dpStatus });
    this.updateVersionCheckServer(this.vcsUrl);
    this.updateLocalServerConfig({
      serverIP: this.curServerIP,
      proxyHttpPort: this.curProxyHttpPort,
      proxySocketPort: this.curProxySocketPort,
      pushSocketPort: this.curPushSocketPort
    });
  }
}
