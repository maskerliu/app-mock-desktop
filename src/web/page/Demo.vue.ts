import Message from "element-ui/packages/message";
import { Component, Vue } from "vue-property-decorator";
import { Action, State } from "vuex-class";
import { isUrl } from "../../common/Utils";
import { BizType, ClientInfo, LocalServerConfig, MsgPushClient, PushMsg, PushMsgType } from "../../model/DataModels";


@Component({
    name: "Demo",
    components: {

    },
})
export default class Demo extends Vue {
    @State((state) => state.Common.localServerConfig)
    localServerConfig: LocalServerConfig;
    @State((state) => state.Common.clientInfos)
    clientInfos: Array<ClientInfo>;

    @Action("saveLocalServerConfig")
    saveLocalServerConfig: Function;
    @Action("sendMessage")
    sendMessage: Function;

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
    ];

    wrapperConfig: LocalServerConfig = {};

    mounted() {
        setTimeout(() => {
            this.wrapperConfig = Object.assign({}, this.localServerConfig);
        }, 500);
    }

    destroyed(): void {

    }

    onDataProxySwitchChanged() {
        if (this.wrapperConfig.dataProxyStatus) {
            if (isUrl(this.wrapperConfig.dataProxyServer)) {
                let config: LocalServerConfig = {
                    dataProxyServer: this.wrapperConfig.dataProxyServer,
                    dataProxyStatus: this.wrapperConfig.dataProxyStatus
                }
                this.saveLocalServerConfig(config);
            } else {
                this.wrapperConfig.dataProxyServer = this.localServerConfig.dataProxyServer;
                this.wrapperConfig.dataProxyStatus = false;
                Message.warning("非法URL");
            }
        } else {
            let config: LocalServerConfig = {
                dataProxyServer: this.wrapperConfig.dataProxyServer,
                dataProxyStatus: this.wrapperConfig.dataProxyStatus
            }
            this.saveLocalServerConfig(config);
        }
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

    showOpMenu(client: MsgPushClient): void {
        this.dialogVisible = true;
        this.selectClient = client;
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

}