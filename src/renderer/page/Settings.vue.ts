import { ipcRenderer } from "electron"
import { Component } from "vue-property-decorator"
import { Action, State } from "vuex-class"
import { IP } from "../../model/DataModels"
import AbstractPage from "./AbstractPage.vue"

import PouchDB from "pouchdb"
import { Message } from "element-ui"


let db = new PouchDB('sharePerferences', { adapter: 'leveldb' });

@Component({
  name: "Settings",
  components: {},
})
export default class Settings extends AbstractPage {
  @State((state) => state.Common.localServerConfig)
  private localServerConfig: any;

  @Action("saveLocalServerConfig")
  private saveLocalServerConfig: Function;

  private form: any = null;
  private ips: Array<IP>;
  private curServerIP: string = null;
  private curProxyHttpPort: number = null;
  public curProxySocketPort: number = null;
  private curPushSocketPort: number = null;
  private statRuleSyncServer: string = null;
  private mockRuleSyncServer: string = null;
  private pbFiles: any[] = null;
  private serialPlugin: number = 3;

  public created(): void {
    this.updateNavBarConfig({
      title: "设置",
      leftItem: false,
      rightItem: false,
    });

    db.get('statRuleSyncServer').then((result: any) => {
      this.statRuleSyncServer = result.url;
    }).catch(err => { })

    db.get('mockRuleSyncServer').then((result: any) => {
      this.mockRuleSyncServer = result.url;
    }).catch(err => { })

    this.ips = this.localServerConfig.ips;
    this.curServerIP = this.localServerConfig.serverIP;
    this.curProxyHttpPort = this.localServerConfig.proxyHttpPort;
    this.curProxySocketPort = this.localServerConfig.proxySocketPort;
    this.curPushSocketPort = this.localServerConfig.pushSocketPort;
    this.pbFiles = this.localServerConfig.pbFiles;
  }

  public destroyed(): void { }

  public onOpenFileDialog(): void {
    ipcRenderer.send("on-open-folder", "openFile");
  }

  public updateStatRuleServer() {
    db.bulkDocs(
      [
        {
          _id: 'statRuleSyncServer',
          url: this.statRuleSyncServer,
        },
      ]
    ).then((res) => {
      Message.success("成功更新埋点数据服务地址");
    }).catch(err => {
      Message.warning("更新埋点数据服务地址失败");
    });
  }

  public updateMockRuleServer() {
    db.bulkDocs(
      [
        {
          _id: 'mockRuleSyncServer',
          url: this.statRuleSyncServer,
        },
      ]
    ).then((res) => {
      Message.success("成功更新Mock数据服务地址");
    }).catch(err => {
      Message.warning("更新Mock数据服务地址失败");
    });
  }

  public onSave(): void {

    db.bulkDocs(
      [
        {
          _id: 'statRuleSyncServer',
          url: this.statRuleSyncServer,
        },
        {
          _id: 'mockRuleSyncServer',
          url: this.mockRuleSyncServer,
        }
      ]
    ).then((res) => {
      console.log(`已经创建完成`);
    }).catch(err => {

    })

    this.saveLocalServerConfig({
      serverIP: this.curServerIP,
      proxyHttpPort: this.curProxyHttpPort,
      proxySocketPort: this.curProxySocketPort,
      pushSocketPort: this.curPushSocketPort
    });
  }
}
