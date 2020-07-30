import {
  CMDCode,
  ProxyRequestRecord,
  ProxyStatRecord,
} from "../model/DataModels";

const websocket = require("nodejs-websocket");

class PushService {
  private wsServer: any = null;
  private clients: {} = {}; // TODO：失效会话清理

  constructor() {

  }

  public initWebSocket(port: number): void {
    this.wsServer = websocket
      .createServer((conn: any) => {
        conn.on("text", (str: string) => {
          this.clients[str] = conn.key;
        });
        conn.on("close", (code: number, reason: any) => {
          console.log("关闭连接");
        });
        conn.on("connect", function (code: number) {
          console.log("开启连接", code);
        });
        conn.on("error", (code: number, reason: any) => {
          console.log("异常关闭");
        });
      })
      .listen(port, () => {
        console.log(`启动本地websoket服务[${port}]`);
      });
  }

  public closeWebSocketServer(callback: any): void {
    if (this.wsServer != null) {
      this.wsServer.close(callback);
    }
  }

  public sendMessage(data: ProxyRequestRecord | ProxyStatRecord, clientUid: string) {

    let connKey = this.clients[clientUid];
    for (let conn of this.wsServer.connections) {
      if (conn.key == connKey) { conn.sendText(JSON.stringify(data)); }
    }
  }
}

export default new PushService();
