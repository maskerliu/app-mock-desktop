import { ipcRenderer } from "electron"
import Message from "element-ui/packages/message"
import { Component } from "vue-property-decorator"
import { Action, State } from "vuex-class"
import { isUrl } from "../../common/Utils"
import { BizType, ClientInfo, CMDType, LocalServerConfig, MsgPushClient, PushMsg, PushMsgType } from "../../model/DataModels"
import AbstractPage from "./AbstractPage.vue"


@Component({
  name: "Settings",
  components: {},
})
export default class Settings extends AbstractPage {
  @State((state) => state.Common.localServerConfig)
  localServerConfig: LocalServerConfig;

  @State((state) => state.Common.clientInfos)
  clientInfos: Array<ClientInfo>;

  @Action("sendMessage")
  sendMessage: Function;

  @Action("saveLocalServerConfig")
  saveLocalServerConfig: Function;

  mrsUrl: string = null;
  pbFiles: any[] = null;
  serialPlugin: number = 3;

  dialogVisible: boolean = false;
  selectClient: MsgPushClient = null;
  broadcastMsg: string = "";
  imMsg: string = "";

  perferences: Array<{ tooltip: string, key: string }> = [
    { tooltip: "代理Http服务端口", key: "proxyHttpPort", },
    { tooltip: "代理长连服务端口", key: "proxySocketPort", },
    { tooltip: "API定义服务地址", key: "apiDefineServer", },
    { tooltip: "埋点规则服务地址", key: "statRuleServer", },
    { tooltip: "代理数据服务地址", key: "dataProxyServer", hasStatus: true, statusKey: "dataProxyStatus" },
    { tooltip: "更新检查服务地址", key: "versionCheckServer", }
  ];

  wrapperConfig: LocalServerConfig = {};

  created(): void {
    this.updateNavBarConfig({
      title: "设置",
      leftItem: false,
      rightItem: false,
    });
    this.wrapperConfig = Object.assign({}, this.localServerConfig);
  }

  destroyed(): void {

  }

  onOpenFileDialog(): void {
    ipcRenderer.send("on-open-folder", "openFile");
  }

  onDataProxySwitchChanged() {
    if (this.wrapperConfig.dataProxyStatus) {
      if (isUrl(this.wrapperConfig.dataProxyServer)) {
        this.onSave();
      } else {
        this.wrapperConfig.dataProxyServer = this.localServerConfig.dataProxyServer;
        this.wrapperConfig.dataProxyStatus = false;
        Message.warning("非法URL");
      }
    } else {
      this.onSave();
    }
  }

  onSave(): void {
    let config: LocalServerConfig = {};

    if (this.wrapperConfig.proxyHttpPort != this.localServerConfig.proxyHttpPort) {
      config.proxyHttpPort = this.wrapperConfig.proxyHttpPort;
    }

    if (this.wrapperConfig.proxySocketPort != this.localServerConfig.proxySocketPort) {
      config.proxySocketPort = this.wrapperConfig.proxySocketPort;
    }

    if (this.wrapperConfig.apiDefineServer != this.localServerConfig.apiDefineServer) {
      config.apiDefineServer = this.wrapperConfig.apiDefineServer;
    }

    if (this.wrapperConfig.statRuleServer != this.localServerConfig.statRuleServer) {
      config.statRuleServer = this.wrapperConfig.statRuleServer;
    }

    if (this.wrapperConfig.dataProxyServer != this.localServerConfig.dataProxyServer ||
      this.wrapperConfig.dataProxyStatus != this.localServerConfig.dataProxyStatus) {
      config.dataProxyServer = this.wrapperConfig.dataProxyServer;
      config.dataProxyStatus = this.wrapperConfig.dataProxyStatus;
    }

    if (this.wrapperConfig.versionCheckServer != this.localServerConfig.versionCheckServer) {
      config.versionCheckServer = this.wrapperConfig.versionCheckServer;
    }

    this.saveLocalServerConfig(config);
  }

  sendBroadcastMsg(): void {
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

  sendMsg(): void {
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

  kickDown(): void {
    this.sendMessage({
      to: this.selectClient.uid,
      type: PushMsgType.CMD,
      payload: {
        type: CMDType.KICKDOWN,
      }
    });
  }

  showOpMenu(client: MsgPushClient): void {
    this.dialogVisible = true;
    this.selectClient = client;
  }
}
