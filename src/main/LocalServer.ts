import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { createServer, Server } from "http";
import { NetworkInterfaceInfo, networkInterfaces } from "os";
import path from "path";
import { BizCode, BizResponse, IP, LocalServerConfig } from "../model/DataModels";
import ProxyService from "./ProxyService";
import PushService from "./PushService";
import WebService from "./WebService";

const JSONBigInt = require("json-bigint");
const config = require("../../config.json");

const CorsOptions: {} = {
  credentials: true,
  optionsSuccessStatus: 200,
};

class LocalServer {
  private localServerConfig: LocalServerConfig;
  private httpServer: Server;
  private httpApp: Application;

  constructor() {
    this.localServerConfig = {
      serverIP: LocalServer.getLocalIPs()[0].address,
      proxyHttpPort: config.proxyHttpPort,
      proxySocketPort: config.proxySocketPort,
      ips: LocalServer.getLocalIPs()
    };
    this.initHttpServer();
  }

  private initHttpServer(): void {
    this.httpApp = express();
    let corsOpts = Object.assign({
      'origin': [
        `http://${this.localServerConfig.serverIP}:${this.localServerConfig.proxyHttpPort}`,
        `https://${this.localServerConfig.serverIP}:${this.localServerConfig.proxyHttpPort}`,
        `http://${this.localServerConfig.serverIP}:9080`,
        `http://${this.localServerConfig.serverIP}:9081`
      ]
    }, CorsOptions);
    this.httpApp.use(cors(corsOpts));
    this.httpApp.use(compression());
    this.httpApp.use(express.static(path.resolve(__dirname, '../web')));
    this.httpApp.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
    this.httpApp.use(bodyParser.text({ type: "application/json", limit: '50mb' }));
    this.httpApp.use((req: any, resp: Response, next: any) => {
      if (/^\/burying-point\//.test(req.url)) {
        let buf = [];
        req.on("data", (data: any) => {
          buf.push(data);
        });
        req.on("end", () => {
          req.rawbody = Buffer.concat(buf);
          ProxyService.handleStatRequest(req, resp);
        });
      }
      next();
    });

    this.httpApp.all("*", (req: Request, resp: Response, next: any) => {
      if (/^\/mw\//.test(req.url) || /^\/appmock\//.test(req.url)) {
        if (/^\/appmock\/getLocalServerConfig/.test(req.url)) {
          let bizResp: BizResponse<LocalServerConfig> = new BizResponse<LocalServerConfig>();
          bizResp.code = BizCode.SUCCESS;
          bizResp.data = this.getLocalServerConfig();
          resp.json(bizResp);
          resp.end();
        } else if (/^\/appmock\/saveLocalServerConfig/.test(req.url)) {
          let config: LocalServerConfig = JSONBigInt.parse(req.body);
          ProxyService.setDataProxyServer(config.dataProxyServer, config.dataProxyStatus, req.query["uid"]);
          this.updateLocalServerConfig(config);
          let bizResp: BizResponse<LocalServerConfig> = new BizResponse<LocalServerConfig>();
          bizResp.code = BizCode.SUCCESS;
          bizResp.data = Object.assign(this.getLocalServerConfig(), ProxyService.getDataProxyServer(req.query["uid"]));
          resp.json(bizResp);
          resp.end();
        } else {
          WebService.filter(req, resp);
        }
      } else if (/^\/burying-point\//.test(req.url)) {
        resp.end();
      } else {
        ProxyService.handleRequest(req, resp);
      }
    });

    this.startProxyHttpServer();
    this.startProxySocketServer();
  }

  private static getLocalIPs(): Array<IP> {
    let ips = [];

    for (let devName in networkInterfaces()) {
      let iface: NetworkInterfaceInfo[] = networkInterfaces()[devName];
      for (let i = 0; i < iface.length; i++) {
        let alias: NetworkInterfaceInfo = iface[i];
        if (alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal) {
          ips.push({
            name: devName,
            netmask: alias.netmask,
            family: alias.family,
            mac: alias.mac,
            internal: alias.internal,
            cidr: alias.cidr,
            address: alias.address,
          });
        }
      }
    }
    return ips;
  }

  public getLocalServerConfig(): LocalServerConfig {
    return this.localServerConfig;
  }

  public updateLocalServerConfig(config: LocalServerConfig): void {
    if ((config.proxyHttpPort && config.proxyHttpPort != this.localServerConfig.proxyHttpPort) ||
      (config.proxySocketPort && config.proxySocketPort != this.localServerConfig.proxySocketPort)) {
      this.startProxyHttpServer();
      this.startProxySocketServer();
    }
    this.localServerConfig = Object.assign(this.localServerConfig, config);
  }

  public startProxyHttpServer(): void {
    try {
      if (this.httpServer) {
        this.httpServer.close((err?: Error) => {
          if (err) {
            console.log(`关闭本地代理服务[${this.localServerConfig.proxyHttpPort}]`, err.message);
          } else {
            this.httpServer = createServer(this.httpApp);
            PushService.bindServer(this.httpServer);
            this.httpServer.listen(
              this.localServerConfig.proxyHttpPort,
              this.localServerConfig.serverIP,
              () => {
                console.log(`++启动本地代理Http服务++[${this.localServerConfig.proxyHttpPort}]`);
              }
            );
          }
        });
      } else {
        this.httpServer = createServer(this.httpApp);
        PushService.bindServer(this.httpServer);
        this.httpServer.listen(
          this.localServerConfig.proxyHttpPort,
          this.localServerConfig.serverIP,
          () => {
            console.log(`--启动本地代理Http服务--[${this.localServerConfig.proxyHttpPort}]`);
          }
        );
      }
    } catch (err) {
      this.httpServer = null;
      console.error("startProxyHttpServer", err);
    }
  }

  // TODO
  public startProxySocketServer(): void {
    try {
    } catch (err) { }
    ProxyService.initProxySocketServer(this.localServerConfig.proxySocketPort);
  }
}

export default new LocalServer();
