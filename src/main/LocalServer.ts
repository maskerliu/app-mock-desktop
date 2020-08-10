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


class LocalServer {
  private serverIP: string;
  private proxyHttpPort: number;
  private proxySocketPort: number;
  private httpServer: Server;
  private httpApp: Application;
  private corsOptions = {
    credentials: true,
    optionsSuccessStatus: 200,
  };

  constructor() {
    this.serverIP = LocalServer.getLocalIPs()[0].address;
    this.proxyHttpPort = 8885;
    this.proxySocketPort = 8886;
    this.corsOptions['origin'] = [
      `http://${this.serverIP}:${this.proxyHttpPort}`,
      `https://${this.serverIP}:${this.proxyHttpPort}`,
      `http://${this.serverIP}:9081`,
      'http://localhost:9080',
      'http://localhost:9081'
    ];
    this.initHttpServer();
  }

  private initHttpServer(): void {
    this.httpApp = express();
    this.httpApp.use(cors(this.corsOptions));
    this.httpApp.use(compression());
    this.httpApp.use(express.static(path.resolve(__dirname, '../web')));
    this.httpApp.use((req: any, resp: Response, next: any) => {
      if (/^\/burying-point\//.test(req.url)) {
        let buf = [];
        req.on("data", (data: any) => {
          buf.push(data);
        });
        req.on("end", () => {
          console.log();
          req.rawbody = Buffer.concat(buf);
          ProxyService.handleStatRequest(req, resp);
        });
      }
      next();
    });

    this.httpApp.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
    this.httpApp.use(bodyParser.text({ type: "application/json", limit: '50mb' }));
    this.httpApp.all("*", (req: Request, resp: Response, next: any) => {
      if (/^\/mw\//.test(req.url) || /^\/appmock\//.test(req.url)) {
        if (/^\/appmock\/getLocalServerConfig/.test(req.url)) {
          let bizResp: BizResponse<LocalServerConfig> = new BizResponse<LocalServerConfig>();
          bizResp.code = BizCode.SUCCESS;
          bizResp.data = this.getLocalServerConfig();
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
  }

  private static getLocalIPs(): Array<IP> {
    let ips = [];

    for (let devName in networkInterfaces()) {
      let iface: NetworkInterfaceInfo[] = networkInterfaces()[devName];
      for (let i = 0; i < iface.length; i++) {
        let alias: NetworkInterfaceInfo = iface[i];
        if (
          alias.family === "IPv4" &&
          alias.address !== "127.0.0.1" &&
          !alias.internal
        ) {
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
    return {
      serverIP: LocalServer.getLocalIPs()[0].address,
      proxyHttpPort: this.proxyHttpPort,
      proxySocketPort: this.proxySocketPort,
      ips: LocalServer.getLocalIPs(),
      pbFiles: ProxyService.getProtoFiles(),
    };
  }

  public updateLocalServerConfig(config: {
    serverIP: string;
    proxyHttpPort: number;
    proxySocketPort: number;
  }): void {
    if (this.serverIP != config.serverIP) {
      this.serverIP = config.serverIP;
      this.proxyHttpPort = config.proxyHttpPort;
      this.proxySocketPort = config.proxySocketPort;

      this.startProxyHttpServer();
      this.startProxySocketServer();
    } else {
      if (this.proxyHttpPort != config.proxyHttpPort) {
        this.serverIP = config.serverIP;
        this.proxyHttpPort = config.proxyHttpPort;
        this.startProxyHttpServer();
      }

      if (this.proxySocketPort != config.proxySocketPort) {
        this.serverIP = config.serverIP;
        this.proxySocketPort = config.proxySocketPort;
        this.startProxySocketServer();
      }
    }
  }

  public startProxyHttpServer(): void {
    try {
      if (this.httpServer) {
        this.httpServer.close((err?: Error) => {
          console.log(`关闭本地代理服务[${this.proxyHttpPort}]`, err);
          this.httpServer = createServer(this.httpApp);
          PushService.bindServer(this.httpServer);
          this.httpServer.listen(
            this.proxyHttpPort,
            this.serverIP,
            () => {
              console.log(`启动本地代理Http服务[${this.proxyHttpPort}]`);
            }
          );
        });
      } else {
        this.httpServer = createServer(this.httpApp);
        PushService.bindServer(this.httpServer);
        this.httpServer.listen(
          this.proxyHttpPort,
          this.serverIP,
          () => {
            console.log(`启动本地代理Http服务[${this.proxyHttpPort}]`);
          }
        );
      }
    } catch (err) {
      console.error("startProxyHttpServer", err);
    }
  }

  // TODO
  public startProxySocketServer(): void {
    try {
    } catch (err) { }
    ProxyService.initProxySocketServer(this.proxySocketPort);
  }
}

export default new LocalServer();
