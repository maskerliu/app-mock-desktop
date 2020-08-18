import { Request, Response } from "express";
import { Server } from "http";
import {
  BizCode, BizResponse,
  BizType, CMDType, MsgPushClient, ProxyRequestRecord, ProxyStatRecord,
  PushMsg, PushMsgType, ClientInfo
} from "../model/DataModels";

// var Extensions = require('websocket-extensions');

const sockjs = require('sockjs');

class PushService {
  private pushClients: {} = {};

  private sockjsServer: any;

  constructor() {
    this.sockjsServer = sockjs.createServer({ prefix: '/echo' });
    this.sockjsServer.on('connection', (conn: any) => {
      conn.on('data', (message: any) => { this.handleMsg(conn, message) });
      conn.on('close', () => { this.handleClose(conn); });
      conn.on("error", () => { this.handleError(conn); });
    });
  }

  private handleMsg(conn: any, data: any): void {
    let msg: PushMsg<any> = JSON.parse(data);
    switch (msg.type) {
      case PushMsgType.CMD: {
        this.handleCMD(conn, msg);
        break;
      }
      case PushMsgType.TXT: {
        this.handleTXT(conn, msg);
        break;
      }
    }
  }

  private handleCMD(conn: any, msg: PushMsg<any>) {
    switch (msg.payload.type) {
      case CMDType.REGISTER:
        let uid = msg.payload.content;
        this.pushClients[uid] = conn;

        let resp: PushMsg<any> = {
          type: PushMsgType.CMD,
          payload: {
            type: CMDType.REGISTER,
            content: uid
          }
        }
        // conn.write(JSON.stringify(resp));
        this.boardcastClientInfos();
        break;
      case CMDType.RECONNECT:
        break;
      case CMDType.KICKDOWN:
        if (this.pushClients[msg.to]) {
          this.pushClients[msg.to].write(JSON.stringify(msg));
        }
        break;
    }
  }

  private handleTXT(conn: any, msg: PushMsg<any>) {
    switch (msg.payload.type) {
      case BizType.IM: {
        if (msg.to == null) {
          for (let key in this.pushClients) {
            if (key == msg.from) continue;
            this.pushClients[key].write(JSON.stringify(msg));
          }
        } else {
          if (this.pushClients[msg.to] != null) {
            this.pushClients[msg.to].write(JSON.stringify(msg));
          }
        }
        break;
      }
    }
  }

  private handleClose(conn: any): void {
    let client: string = null;
    for (let key in this.pushClients) {
      if (this.pushClients[key].id == conn.id) {
        client = key;
        break;
      }
    }
    if (client != null) delete this.pushClients[client];

    this.boardcastClientInfos();
  }

  private handleError(conn: any): void {
    let client: string = null;
    for (let key in this.pushClients) {
      if (this.pushClients[key].id == conn.id) {
        client = key;
        break;
      }
    }
    if (client != null) delete this.pushClients[client];

    this.boardcastClientInfos();
  }

  public bindServer(httpServer: Server): void {
    this.sockjsServer.installHandlers(httpServer);
  }

  public closeWebSocketServer(callback: any): void {
    this.pushClients = {};
    this.sockjsServer.close();
  }

  public sendMessage(data: PushMsg<any>, clientUid: string) {
    if (this.pushClients[clientUid] != null) {
      this.pushClients[clientUid].write(JSON.stringify(data));
    }
  }

  public boardcastClientInfos() {
    let data: Array<ClientInfo> = [];
    for (let key in this.pushClients) {
      let client = this.pushClients[key];
      data.push({
        key: client.id,
        uid: key,
        ip: client.remoteAddress,
        port: client.remotePort
      });
    }

    let msg: PushMsg<Array<ClientInfo>> = {
      type: PushMsgType.TXT,
    };
    msg.payload = {
      type: BizType.ClientInfos,
      content: data
    };

    for (let key in this.pushClients) {
      this.pushClients[key].write(JSON.stringify(msg));
    }
  }

  public sendProxyMessage(data: ProxyRequestRecord | ProxyStatRecord, clientUid: string) {

    let pushMsg: PushMsg<ProxyRequestRecord | ProxyStatRecord> = {
      type: PushMsgType.TXT,
      payload: {
        type: BizType.Proxy,
        content: data
      }
    }

    if (this.pushClients[clientUid] != null) {
      this.pushClients[clientUid].write(JSON.stringify(pushMsg));
    }
  }

  public getAllPushClients(req: Request, resp: Response) {
    let bizResp: BizResponse<Array<MsgPushClient>> = new BizResponse<Array<MsgPushClient>>();
    bizResp.code = BizCode.SUCCESS;
    bizResp.data = [];
    for (let key in this.pushClients) {
      let client = this.pushClients[key];
      bizResp.data.push({
        key: client.id,
        uid: key,
        ip: client.remoteAddress,
        port: client.remotePort
      });
    }

    resp.json(bizResp);
    resp.end();
  }

}

export default new PushService();
