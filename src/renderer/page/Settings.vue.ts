import { Component, Vue } from "vue-property-decorator"
import { Action, namespace, Getter, Mutation, State } from "vuex-class"

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

    // @State(state => state.Common.localServerConfig.ips)
    private ips: Array<IP>;

    @Action("saveLocalServerConfig")
    private saveLocalServerConfig: Function;

    private form: any = null;
    private curServerIP: string = null;
    private curServerPort: number = 8888;
    private curWebsocketPort: number = 8889;
    private ruleSyncServer: string = null;
    private serialPlugin: number = 3;

    created() {
        this.updateNavBarConfig({
            title: "设置",
            leftItem: false,
            rightItem: false,
        });

        this.curServerIP = this.localServerConfig.serverIP;
        this.curServerPort = this.localServerConfig.serverPort;
        this.curWebsocketPort = this.localServerConfig.websocketPort;
        this.ips = this.localServerConfig.ips;
    }

    onSave() {
        this.saveLocalServerConfig({
            serverIP: this.curServerIP,
            serverPort: this.curServerPort,
            websocketPort: this.curWebsocketPort
        });
    }
}
