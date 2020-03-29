import { Component, Vue } from "vue-property-decorator"
import { Action, namespace, Getter, Mutation, State } from "vuex-class"

import { ipcRenderer } from "electron"

import AbstractPage from "./AbstractPage.vue"
import { IP } from "../../model/DataModels"

@Component({
    name: "Settings",
    components: {

    },
})
export default class Settings extends AbstractPage {
    @State(state => state.Common.localServerConfig)
    private localServerConfig: any;

    @Action("saveLocalServerConfig")
    private saveLocalServerConfig: Function;

    private form: any = null;
    private ips: Array<IP>;
    private curServerIP: string = null;
    private curProxyHttpPort: number = null;
    public curProxySocketPort: number = null;
    private curPushSocketPort: number = null;
    private ruleSyncServer: string = null;
    private serialPlugin: number = 3;

    created() {
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
        this.ruleSyncServer = this.localServerConfig.ruleSyncServer;
    }

    public onOpenFileDialog(): void {
        ipcRenderer.send("on-open-folder", "openFile");
    }

    public onSave(): void {
        this.saveLocalServerConfig({
            serverIP: this.curServerIP,
            proxyHttpPort: this.curProxyHttpPort,
            proxySocketPort: this.curProxySocketPort,
            pushSocketPort: this.curPushSocketPort,
            ruleSyncServer: this.ruleSyncServer
        });
    }
}
