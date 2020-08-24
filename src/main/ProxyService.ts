import { Request, Response } from "express";
import protobuf from "protobufjs";
import zlib from "zlib";
import { BizCode, BizResponse, PorxyType, ProxyRequestRecord, ProxyStatRecord } from "../model/DataModels";
import MockService from "./MockService";
import PushService from "./PushService";

const JSONBigInt = require("json-bigint");
const axios = require("axios");

class ProxyService {
  private static PROXY_DEF_TIMEOUT: number = 1000 * 15; // 15s
  private _sessionId: number;
  private proxySocketServer: any = null;
  private pbFiles: Array<{ name: string; value: string }> = null;

  /**
   * {
   *  uid: {
   *    delay: 500,
   *    dataProxyServer: http://10.10.120.119,
   *    dataProxyStatus: true
   * }
   * }
   */
  private proxyPrefs: {} = {};

  constructor() {
    this._sessionId = 0;
  }

  public setDataProxyServer(url: string, status: boolean, uid: any) {
    if (this.proxyPrefs[uid] == null) this.proxyPrefs[uid] = {};

    this.proxyPrefs[uid] = Object.assign(this.proxyPrefs[uid], {
      dataProxyServer: url,
      dataProxyStatus: status
    });
  }

  public getDataProxyServer(uid: any) {
    if (this.proxyPrefs[uid]) {
      return {
        dataProxyServer: this.proxyPrefs[uid].dataProxyServer,
        dataProxyStatus: this.proxyPrefs[uid].dataProxyStatus
      }
    } else return {};
  }

  public setProxyDelay(req: Request, resp: Response): void {
    let uid: any = req.query["uid"];
    let isDelay: any = req.query["isOpen"];
    let delay: any = req.query["delay"];

    if (isDelay) {
      this.proxyPrefs[uid] = Object.assign(this.proxyPrefs[uid], { delay: delay });
    } else {
      delete this.proxyPrefs[uid].delay;
    }

    let bizResp: BizResponse<string> = new BizResponse<string>();
    bizResp.code = BizCode.SUCCESS;
    bizResp.data = "success";
    resp.json(bizResp);
    resp.end();
  }

  // TODO: 长连接统带代理初始化，待完善
  public initProxySocketServer(port: number): void {
    // this.proxySocketServer = websocket
    //   .createServer((conn: any) => {
    //     conn.on("text", (str: string) => {
    //       conn.sendText(str);
    //     });
    //     conn.on("close", (code: number, reason: any) => {
    //       console.log("关闭连接");
    //     });
    //     conn.on("connect", function (code: number) {
    //       console.log("开启连接", code);
    //     });
    //     conn.on("error", (code: number, reason: any) => {
    //       console.log("异常关闭");
    //     });
    //   })
    //   .listen(port, () => {
    //     console.log(`启动本地代理Socket服务[${port}]`);
    //   });
  }

  // TODO: 待完成
  public closeProxySocketServer(callback: any): void {
    // if (this.proxySocketServer != null) {
    //   this.proxySocketServer.close(callback);
    // }
  }

  // TODO: PB数据序列化支持
  public setProtoFiles(files: string[]) {
    files.forEach((item: string) => {
      var strs = item.split("/");
      this.pbFiles.push({ name: strs[strs.length - 1], value: item });
    });

    protobuf.load(files, function (err: Error, root: any) {
      if (err) throw err;

      var MatchQueryMsgReq = root.lookupType("MatchQueryMsgReq");

      var payload = { gameType: "shuishiwodi" };
      var message = MatchQueryMsgReq.create(payload);
      var buffer = MatchQueryMsgReq.encode(message).finish();
      console.log(MatchQueryMsgReq.decode(buffer));
    });
  }

  public getProtoFiles() {
    return this.pbFiles;
  }

  public handleStatRequest(req: any, resp: Response) {
    let data = Buffer.from(req.rawbody);
    zlib.unzip(data, (err: any, buffer: any) => {
      if (!err) {
        let record: ProxyStatRecord = {
          id: ++this._sessionId,
          type: PorxyType.STATISTICS,
          timestamp: new Date().getSeconds(),
          statistics: JSON.parse(buffer.toString()),
        };


        let originHost = req.header("mock-host");
        if (originHost == null) {
          originHost = req.header("host");
        }

        PushService.sendProxyMessage(record, req.header("mock-uid"));
        let headers = Object.assign({}, req.headers);
        delete headers["host"];
        delete headers["mock-host"];
        delete headers["mock-uid"];

        let requestUrl = originHost + req.path;
        let options = {
          url: requestUrl,
          method: req.method,
          headers: headers,
          data: data
        };
        axios(options).then((resp: any) => {
          // console.log("stat", requestUrl, resp.status, new Date().getSeconds());
        }).catch((err: any) => {
          // console.error("stat", err);
        });
      } else {
        console.error("stat", err);
      }
    });
    resp.end();
  }

  public handleRequest(req: Request, resp: Response) {
    // 清理无效配置
    Object.keys(this.proxyPrefs).forEach(key => {
      if (PushService.pushClients[key] == null) delete this.proxyPrefs[key];
    });

    let startTime = new Date().getTime();
    let sessionId = ++this._sessionId;

    let requestData = null;
    if (req.method === "GET") {
      requestData = !!req.query ? req.query : null;
    } else {
      try {
        requestData = !!req.body && Object.keys(req.body).length > 0 ? JSONBigInt.parse(req.body) : null;
      } catch (err) {
        console.log("test", req.body, req.body);
        console.error("handleRequest", err);
      }
    }
    let data: ProxyRequestRecord = {
      id: sessionId,
      type: PorxyType.REQUEST_START,
      url: req.url,
      method: req.method,
      headers: req.headers,
      requestData: requestData,
      timestamp: new Date().getSeconds(),
    };

    let uid = req.header("mock-uid");
    PushService.sendProxyMessage(data, uid);

    let delay: number = this.proxyPrefs[uid] != null && this.proxyPrefs[uid].hasOwnProperty("delay") ? parseInt(this.proxyPrefs[uid].delay) : 0;

    MockService.mockRequestData(sessionId, req, resp, startTime, delay).then(() => {
      // console.log("proxy is mock");
    }).catch(reason => {
      this.proxyRequestData(sessionId, req, resp, startTime, delay);
    });
  }

  private proxyRequestData(sessionId: number, req: Request, proxyResp: Response, startTime: number, delay: number) {
    let originHost = req.header("mock-host");
    if (originHost == null) {
      originHost = req.header("host");
    }

    let headers = Object.assign({}, req.headers);
    delete headers["host"];
    delete headers["mock-host"];
    delete headers["mock-uid"];

    let requestUrl = originHost + req.path;

    let dataProxyServer = null;
    let dataProxyStatus = false;

    let uid = req.header("mock-uid");
    if (this.proxyPrefs[uid]) {
      if (this.proxyPrefs[uid].hasOwnProperty("dataProxyServer")) {
        dataProxyServer = this.proxyPrefs[uid].dataProxyServer;
      }
      if (this.proxyPrefs[uid].hasOwnProperty("dataProxyStatus")) {
        dataProxyStatus = this.proxyPrefs[uid].dataProxyStatus;
      }
    }

    if (dataProxyServer != null && dataProxyStatus) {
      requestUrl = dataProxyServer + req.path;
    }

    console.log(requestUrl);

    let options = {
      url: requestUrl,
      method: req.method,
      headers: headers,
      transformResponse: [
        (data: any) => {
          try {
            return JSONBigInt.parse(data);
          } catch (err) {
            console.error("proxyRequestData", err);
            console.error(data);
            return null;
          }
        },
      ],
      timeout: ProxyService.PROXY_DEF_TIMEOUT,
    };

    if (JSON.stringify(req.query) !== "{}") {
      options["params"] = req.query;
    }
    if (JSON.stringify(req.body) !== "{}") {
      options["data"] = req.body;
    }

    axios(options).then((resp: any) => {
      setTimeout(() => {
        let data: ProxyRequestRecord = {
          id: sessionId,
          type: PorxyType.REQUEST_END,
          statusCode: resp.status,
          responseHeaders: !!resp.headers ? resp.headers : null,
          responseData: !!resp.data ? JSON.stringify(resp.data) : null,
          time: new Date().getTime() - startTime,
          isMock: false,
        };
        PushService.sendProxyMessage(data, uid);

        proxyResp.send(resp.data);
        proxyResp.end();
      }, delay);
    }).catch((err: any) => {
      console.error("axios", err.code);
      let resp = err.response;
      let respData = !!resp ? resp.data : err.message;
      let data: ProxyRequestRecord = {
        id: sessionId,
        type: PorxyType.REQUEST_END,
        statusCode: -100,
        headers: !!resp && !!resp.headers ? resp.headers : null,
        responseData: !!resp && !!respData ? JSON.stringify(respData) : JSON.stringify(err),
        time: new Date().getTime() - startTime,
        isMock: false,
      };
      PushService.sendProxyMessage(data, uid);
      proxyResp.send(err.message);
      proxyResp.end();
    });
  }

}

export default new ProxyService();
