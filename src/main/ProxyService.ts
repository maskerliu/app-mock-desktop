import { Request, Response } from "express";
import Url from "url";
import MockService from "./MockService";
import PushService from "./PushService";
import protobuf from "protobufjs";
import { CMDCode, ProxyRequestRecord } from "../model/DataModels";

const JSONBigInt = require("json-bigint");
const axios = require("axios");
const websocket = require("nodejs-websocket");

class ProxyService {
  private static PROXY_DEF_TIMEOUT: number = 1000 * 15; // 15s
  private _sessionId: number;
  private proxyDealy: number;
  private proxySocketServer: any = null;
  private pbFiles: Array<{ name: string; value: string }> = null;

  constructor() {
    this._sessionId = 0;
  }

  public setProxyDelay(delay: number) {
    this.proxyDealy = delay;
  }

  public initProxySocketServer(port: number): void {
    this.proxySocketServer = websocket
      .createServer((conn: any) => {
        conn.on("text", (str: string) => {
          conn.sendText(str);
        });
        conn.on("close", (code: number, reason: any) => {
          console.log("关闭连接");
        });
        conn.on("connect", function(code: number) {
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

  public closeProxySocketServer(callback: any): void {
    if (this.proxySocketServer != null) {
      this.proxySocketServer.close(callback);
    }
  }

  public handleRequest(req: Request, resp: Response) {
    let startTime = new Date().getTime();
    let sessionId = ++this._sessionId;
    // PushService.sendRequestStartMessage(req, sessionId);

    let reqUrl = Url.parse(req.header("host"));
    let requestData = null;
    if (req.method === "GET") {
      requestData = !!req.query ? req.query : null;
    } else {
      requestData = !!req.body ? JSONBigInt.parse(req.body) : null;
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

    PushService.sendMessage(data);

    if (
      MockService.mockRequestData(
        sessionId,
        req,
        resp,
        startTime,
        this.proxyDealy
      )
    )
      return;
    this.proxyRequestData(sessionId, req, resp, startTime);
  }

  public setProtoFiles(files: string[]) {
    files.forEach((item: string) => {
      var strs = item.split("/");
      this.pbFiles.push({ name: strs[strs.length - 1], value: item });
    });

    protobuf.load(files, function(err: Error, root: any) {
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

  private proxyRequestData(
    sessionId: number,
    req: Request,
    proxyResp: Response,
    startTime: number
  ) {
    let originHost = req.header("x-host");
    if (originHost == null) {
      originHost = req.header("host");
    }

    let url = Url.parse(originHost);
    let host = url.host.split(/[:\/]/)[0];
    let port = url.port;
    let protocol = url.protocol;

    let headers = Object.assign({}, req.headers);
    headers.host = protocol + "//" + host;

    delete headers["host"];
    delete headers["x-host"];

    let options = {
      url: protocol + "//" + host + req.path,
      method: req.method,
      headers: headers,
      transformResponse: [
        (data: any) => {
          try {
            return JSONBigInt.parse(data);
          } catch (err) {
            console.log(data);
            console.log(err);
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

    axios(options)
      .then((resp: any) => {
        try {
          setTimeout(() => {
            // PushService.sendRequestEndMessage(sessionId, startTime, resp.status, resp.headers, resp.data, false);

            let data: ProxyRequestRecord = {
              id: sessionId,
              type: CMDCode.REQUEST_END,
              statusCode: resp.status,
              headers: !!resp.headers ? resp.headers : null,
              responseData: !!resp.data ? JSON.stringify(resp.data) : null,
              time: new Date().getTime() - startTime,
              isMock: false,
            };
            PushService.sendMessage(data);

            proxyResp.send(resp.data);
            proxyResp.end();
          }, this.proxyDealy);
        } catch (err) {
          console.log(err);
        }
      })
      .catch((err: any) => {
        let resp = err.response;
        if (!!resp) {
          PushService.sendRequestEndMessage(
            sessionId,
            startTime,
            -100,
            resp.headers,
            resp.data,
            false
          );
          proxyResp.send(resp.data);
          proxyResp.end();
        } else {
          PushService.sendRequestEndMessage(
            sessionId,
            startTime,
            -100,
            null,
            err.message,
            false
          );
          proxyResp.send(err.message);
          proxyResp.end();
        }
      });
  }
}

export default new ProxyService();
