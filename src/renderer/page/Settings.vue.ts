import { ipcRenderer } from "electron"
import Message from "element-ui/packages/message"
import { Component } from "vue-property-decorator"
import { Mutation, State, Action } from "vuex-class"
import { isUrl } from "../../common/Utils"
import { IP, MsgPushClient, PushMsgType, PushMsg, BizType, CMDType } from "../../model/DataModels"
import AbstractPage from "./AbstractPage.vue"
import { getAllPushClients } from "../../model/LocaAPIs"


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


  @Action("sendMessage")
  private sendMessage: Function;

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

  private dialogVisible: boolean = false;
  private selectClient: MsgPushClient = null;
  private broadcastMsg: string = "";
  private imMsg: string = "";
  private clients: {} = {};

  private ips: Array<IP>;
  private curServerIP: string = null;
  private curProxyHttpPort: number = null;
  private curProxySocketPort: number = null;
  private adsUrl: string = null;
  private srsUrl: string = null;
  private mrsUrl: string = null;
  private dpsUrl: string = null;
  private dpStatus: boolean = false;
  private vcsUrl: string = null;
  private pbFiles: any[] = null;
  private serialPlugin: number = 3;

  private syncClientsTimer: any;

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
    this.pbFiles = this.localServerConfig.pbFiles;

    this.adsUrl = this.apiDefineServer;
    this.srsUrl = this.statRuleServer;
    this.mrsUrl = this.mockRuleServer;
    this.dpsUrl = this.dataProxyServer;
    this.dpStatus = this.dataProxyStatus;
    this.vcsUrl = this.versionCheckServer;

    this.syncClientsTimer = setInterval(() => {
      this.getOnlineClients();
    }, 3000);
  }

  public destroyed(): void {
    clearInterval(this.syncClientsTimer);
  }

  public onOpenFileDialog(): void {
    ipcRenderer.send("on-open-folder", "openFile");
  }

  public getOnlineClients() {
    getAllPushClients().then(resp => {
      this.clients = resp.data.data;
    }).catch(err => { })
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
    });
  }
  public sendBroadcastMsg(): void {
    let msg: PushMsg<any> = {
      type: PushMsgType.TXT,
      payload: {
        type: BizType.IM,
        content: this.broadcastMsg
      }
    }
    this.sendMessage(msg);
    this.broadcastMsg = "";
  }

  public sendMsg(): void {
    let msg: PushMsg<any> = {
      to: this.selectClient.uid,
      type: PushMsgType.TXT,
      payload: {
        type: BizType.IM,
        content: this.imMsg
      }
    }
    this.sendMessage(msg);
    this.imMsg = "";
  }

  public kickDown(): void {
    this.sendMessage({
      to: this.selectClient.uid,
      type: PushMsgType.CMD,
      payload: {
        type: CMDType.KICKDOWN,
      }
    });
  }

  public showOpMenu(client: MsgPushClient): void {
    this.dialogVisible = true;
    this.selectClient = client;
  }
}
