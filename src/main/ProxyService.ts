import { Request, Response } from "express";
import protobuf from "protobufjs";
import Url from "url";
import zlib from "zlib";
import { CMDCode, ProxyRequestRecord, ProxyStatRecord } from "../model/DataModels";
import MockService from "./MockService";
import PushService from "./PushService";

const JSONBigInt = require("json-bigint");
const axios = require("axios");
const websocket = require("nodejs-websocket");

class ProxyService {
  private static PROXY_DEF_TIMEOUT: number = 1000 * 5; // 15s
  private _sessionId: number;
  private proxyDealy: number;
  private isProxyRequest: boolean;
  private isPorxyStat: boolean;
  private dataProxyServer: string;
  private proxySocketServer: any = null;
  private dataProxyStatus: boolean = false;
  private pbFiles: Array<{ name: string; value: string }> = null;

  constructor() {
    this._sessionId = 0;
  }

  public setDataProxyServer(url: string, status: boolean) {
    this.dataProxyServer = url;
    this.dataProxyStatus = status;
  }
  public setProxyDelay(delay: number) {
    this.proxyDealy = delay;
  }

  public setProxyRequest(isProxy: boolean) {
    this.isProxyRequest = isProxy;
  }

  public setStatProxy(isProxy: boolean) {
    this.isPorxyStat = isProxy;
  }

  // TODO: 长连接统带代理初始化，待完善
  public initProxySocketServer(port: number): void {
    this.proxySocketServer = websocket
      .createServer((conn: any) => {
        conn.on("text", (str: string) => {
          conn.sendText(str);
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
        console.log(`启动本地代理Socket服务[${port}]`);
      });
  }

  // TODO: 待完成
  public closeProxySocketServer(callback: any): void {
    if (this.proxySocketServer != null) {
      this.proxySocketServer.close(callback);
    }
  }

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
          type: CMDCode.STATISTICS,
          timestamp: new Date().getSeconds(),
          statistics: JSON.parse(buffer.toString()),
        };


        let originHost = req.header("host");
        if (originHost == null) {
          originHost = req.header("mock-host");
        }

        PushService.sendMessage(record, req.header("mock-uid"));

        let url = Url.parse(originHost);
        let host = url.host.split(/[:\/]/)[0];
        let port = url.port;
        let protocol = url.protocol;

        let headers = Object.assign({}, req.headers);
        headers.host = protocol + "//" + host;

        delete headers["host"];
        delete headers["mock-host"];
        delete headers["mock-uid"];

        let requestUrl = protocol + "//" + host + req.path;
        if (this.dataProxyServer != null && this.dataProxyStatus) {
          requestUrl = this.dataProxyServer + req.path;
        }

        let options = {
          url: requestUrl,
          method: req.method,
          headers: headers,
          data: data
        };
        axios(options).then((resp: any) => {
          // console.log("stat", requestUrl, resp.status, new Date().getSeconds());
        }).catch((err: any) => {
          console.error("stat", err.errno);
        });
      } else {
        console.error("stat", err);
      }
    });
    resp.end();
  }

  public handleRequest(req: Request, resp: Response) {
    let startTime = new Date().getTime();
    let sessionId = ++this._sessionId;
    let reqUrl: Url.UrlWithStringQuery;
    try {
      reqUrl = Url.parse(req.headers.host);
    } catch (err) {
      console.error("handleRequest", err);
    }

    let requestData = null;
    if (req.method === "GET") {
      requestData = !!req.query ? req.query : null;
    } else {
      try {
        requestData = !!req.body && req.body != {} ? JSONBigInt.parse(req.body) : null;
      } catch (err) {
        console.error("handleRequest", err);
      }
    }

    let data: ProxyRequestRecord = {
      id: sessionId,
      type: CMDCode.REQUEST_START,
      url: req.url,
      method: req.method,
      headers: req.headers,
      proxyport: reqUrl.port,
      requestData: requestData,
      timestamp: new Date().getSeconds(),
    };


    PushService.sendMessage(data, req.header("mock-uid"));

    MockService.mockRequestData(sessionId, req, resp, startTime, this.proxyDealy).then(() => {
      // console.log("proxy is mock");
    }).catch(reason => {
      this.proxyRequestData(sessionId, req, resp, startTime);
    });
    // if (!MockService.mockRequestData(sessionId, req, resp, startTime, this.proxyDealy))
    //   this.proxyRequestData(sessionId, req, resp, startTime);
  }

  private proxyRequestData(sessionId: number, req: Request, proxyResp: Response, startTime: number) {
    let originHost = req.header("host");
    if (originHost == null) {
      originHost = req.header("mock-host");
    }

    let url = Url.parse(originHost);
    let host = url.host.split(/[:\/]/)[0];
    let port = url.port;
    let protocol = url.protocol;

    let headers = Object.assign({}, req.headers);
    headers.host = protocol + "//" + host;

    delete headers["host"];
    delete headers["mock-host"];
    delete headers["mock-uid"];

    let requestUrl = protocol + "//" + host + req.path;
    if (this.dataProxyServer != null && this.dataProxyStatus) {
      requestUrl = this.dataProxyServer + req.path;
    }

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
      try {
        setTimeout(() => {
          let data: ProxyRequestRecord = {
            id: sessionId,
            type: CMDCode.REQUEST_END,
            statusCode: resp.status,
            responseHeaders: !!resp.headers ? resp.headers : null,
            responseData: !!resp.data ? JSON.stringify(resp.data) : null,
            time: new Date().getTime() - startTime,
            isMock: false,
          };
          PushService.sendMessage(data, req.header("mock-uid"));

          proxyResp.send(resp.data);
          proxyResp.end();
        }, this.proxyDealy);
      } catch (err) {
        console.error("proxyRequestData", err);
      }
    }).catch((err: any) => {
      console.log("axios", err);
      let resp = err.response;
      let respData = !!resp ? resp.data : err.message;
      let data: ProxyRequestRecord = {
        id: sessionId,
        type: CMDCode.REQUEST_END,
        statusCode: -100,
        headers: !!resp && !!resp.headers ? resp.headers : null,
        responseData: !!resp && !!respData ? JSON.stringify(respData) : JSON.stringify(err),
        time: new Date().getTime() - startTime,
        isMock: false,
      };
      PushService.sendMessage(data, req.header("mock-uid"));
      proxyResp.send(err.message);
      proxyResp.end();
    });
  }
}

export default new ProxyService();
