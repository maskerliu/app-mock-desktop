import { Component, Vue } from "vue-property-decorator";
import { Action, State } from "vuex-class";
import { BizType, MsgPushClient, PushMsg, PushMsgType, ClientInfo } from "../../model/DataModels";
import { getAllPushClients } from "../../model/LocaAPIs";


@Component({
    name: "Demo",
    components: {

    },
})
export default class Demo extends Vue {
    @Action("sendMessage")
    sendMessage: Function;

    @State((state) => state.Common.clientInfos)
    clientInfos: Array<ClientInfo>;

    private dialogVisible: boolean = false;
    private selectClient: MsgPushClient = null;
    private broadcastMsg: string = "";
    private imMsg: string = "";
    private clients: {} = {};

    private syncClientsTimer: any;

    mounted() {

    }

    destroyed(): void {
        clearInterval(this.syncClientsTimer);
    }

    public getOnlineClients() {
        getAllPushClients().then(resp => {
            this.clients = resp.data.data;
        }).catch(err => { })
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

    public showOpMenu(client: MsgPushClient): void {
        this.dialogVisible = true;
        this.selectClient = client;
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

}