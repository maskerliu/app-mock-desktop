import { Request, Response } from "express";
import { Server } from "http";
import {
  BizCode, BizResponse,
  BizType,
  ClientInfo, CMDType, MsgPushClient, ProxyRequestRecord, ProxyStatRecord,
  PushMsg, PushMsgType
} from "../model/DataModels";

const sockjs = require('sockjs');

class PushService {
  public pushClients: {} = {};

  private sockjsServer: any;

  constructor() {
    this.sockjsServer = sockjs.createServer({ prefix: '/echo', transports: 'websocket' });
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
        let uid = msg.payload.content.uid;
        this.pushClients[uid] = { conn: conn, username: msg.payload.content.username };
        this.boardcastClientInfos();
        break;
      case CMDType.RECONNECT:
        break;
      case CMDType.KICKDOWN:
        if (this.pushClients[msg.to])
          this.pushClients[msg.to].conn.write(JSON.stringify(msg));
        break;
    }
  }

  private handleTXT(conn: any, msg: PushMsg<any>) {
    switch (msg.payload.type) {
      case BizType.IM: {
        if (msg.to == null) {
          Object.keys(this.pushClients).forEach(key => {
            if (key != msg.from) this.pushClients[key].write(JSON.stringify(msg));
          });
        } else {
          if (this.pushClients[msg.to] != null) {
            this.pushClients[msg.to].conn.write(JSON.stringify(msg));
          }
        }
        break;
      }
    }
  }

  private handleClose(conn: any): void {
    Object.keys(this.pushClients).forEach(key => {
      if (this.pushClients[key].conn.id == conn.id) { delete this.pushClients[key]; }
    });

    this.boardcastClientInfos();
  }

  private handleError(conn: any): void {
    Object.keys(this.pushClients).forEach(key => {
      if (this.pushClients[key].conn.id == conn.id) delete this.pushClients[key];
    });

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
      this.pushClients[clientUid].conn.write(JSON.stringify(data));
    }
  }

  public boardcastClientInfos() {
    let data: Array<ClientInfo> = [];
    Object.keys(this.pushClients).forEach(key => {
      let client = this.pushClients[key];
      data.push({
        key: client.conn.id,
        uid: key,
        username: client.username,
        ip: client.conn.remoteAddress,
        port: client.conn.remotePort
      });
    });

    let msg: PushMsg<Array<ClientInfo>> = {
      type: PushMsgType.TXT,
    };
    msg.payload = {
      type: BizType.ClientInfos,
      content: data
    };

    Object.keys(this.pushClients).forEach(key => {
      this.pushClients[key].conn.write(JSON.stringify(msg));
    });
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
      this.pushClients[clientUid].conn.write(JSON.stringify(pushMsg));
    }
  }

  public getAllPushClients(req: Request, resp: Response) {
    let bizResp: BizResponse<Array<MsgPushClient>> = new BizResponse<Array<MsgPushClient>>();
    bizResp.code = BizCode.SUCCESS;
    bizResp.data = [];

    Object.keys(this.pushClients).forEach(key => {
      let client = this.pushClients[key];
      bizResp.data.push({
        key: client.conn.id,
        uid: key,
        username: client.username,
        ip: client.conn.remoteAddress,
        port: client.conn.remotePort
      });
    });

    resp.json(bizResp);
    resp.end();
  }

}

export default new PushService();
