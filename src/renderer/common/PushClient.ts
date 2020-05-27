import { Message } from "element-ui";
import Vue from "vue";
import VueNativeSocket from "vue-native-websocket";
import { CMDCode } from "../../model/DataModels";
import store from "../store";

class PushClient {
  private SocketConfig: {};
  private vm: Vue;

  constructor() {
    this.SocketConfig = {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      format: "json",
      connectManually: true,
    };
    Vue.use(VueNativeSocket, "ws://localhost:8887", this.SocketConfig);
    this.vm = new Vue();
  }

  public start(serverIP: string, port: number): void {
    try {
      this.vm.$disconnect();
    } catch (err) {
      console.log(err);
    }

    this.vm.$connect(`ws://${serverIP}:${port}`, this.SocketConfig);
    Vue.prototype.$socket.onmessage = (stream: any) => {
      this.handleMsg(stream.data);
    };
  }

  private handleMsg(data: any): void {
    let msg = JSON.parse(data);
    switch (msg.type) {
      case CMDCode.REGISTER_SUCCESS:
        store.commit("updateShowQrCodeDialog", false);
        Message({ message: "设备[" + msg.data + "]注册成功", type: "success" });
        break;
      case CMDCode.REQUEST_START:
      case CMDCode.REQUEST_END:
        store.commit("ProxyRecords/updateProxyRecords", msg);
        break;
      case CMDCode.STATISTICS:
        store.commit("ProxyRecords/updateProxyRecords", msg);
        break;
      default:
        Message({ message: "unhandled code:" + msg.code, type: "warning" });
    }
  }
}

export default new PushClient();
