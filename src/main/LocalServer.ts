import bodyParser from "body-parser"
import compression from "compression"
import cors from "cors"
import express, { Application, Request, Response } from "express"
import { NetworkInterfaceInfo, networkInterfaces } from "os"
import zlib from "zlib"
import { IP } from "../model/DataModels"
import ProxyService from "./ProxyService"
import PushService from "./PushService"
import WebService from "./WebService"


const corsOptions = {
    origin: "http://localhost:9080",
    credentials: true,
    optionsSuccessStatus: 200
};

class LocalServer {
    private _sessionId: number;
    private curServerIP: string;
    private curServerPort: number;
    private curWebSocketPort: number;
    private httpServer: Application;

    constructor() {
        this._sessionId = 0;
        this.curServerIP = this.getDefaultLocalIP();
        this.curServerPort = 8888;
        this.curWebSocketPort = 8889;
        this.initHttpServer();
    }

    private initHttpServer() {
        this.httpServer = express();
        this.httpServer.use(cors(corsOptions));
        this.httpServer.use(compression());
        this.httpServer.use((req: any, resp: Response, next: any) => {
            if (req.url === "/burying-point/collect") {
                let buf = [];
                req.on("data", (data: any) => {
                    buf.push(data);
                });
                req.on("end", () => {
                    req.rawbody = Buffer.concat(buf);
                });
            }
            next();
        });

        this.httpServer.post("/burying-point/collect", bodyParser.raw({ type: "text/plain" }), (req: any, resp: any) => {
            let data = Buffer.from(req.rawbody);
            zlib.unzip(data, (err: any, buffer: any) => {
                if (!err) {
                    // TODO
                    PushService.sendStatisticsMessage(0, JSON.parse(buffer.toString()));
                } else {
                    console.log(err);
                }
            });
            resp.end();
        });

        this.httpServer.use(bodyParser.urlencoded({ extended: true }));
        this.httpServer.use(bodyParser.text({ type: "application/json" }));
        this.httpServer.all("*", (req: Request, resp: Response, next: any) => {
            if (req.url === "/" || /^\/appmock\//.test(req.url) || /^\/burying-point\//.test(req.url)) {
                WebService.filter(req, resp);
            } else if (req.url !== "/favicon.ico") {
                ProxyService.handleRequest(req, resp);
            } else {
                resp.end();
            }
        });
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
                        address: alias.address
                    });
                }
            }
        }
        return ips;
    }

    private getDefaultLocalIP(): string {
        let tempAddress = "127.0.0.1";
        for (let devName in networkInterfaces()) {
            let iface = networkInterfaces()[devName];
            for (let i = 0; i < iface.length; i++) {
                let alias = iface[i];
                if (alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal) {
                    if (new RegExp("^192.168").test(alias.address)) {
                        return alias.address;
                    }
                    tempAddress = alias.address;
                }
            }
        }
        return tempAddress;
    }

    public getLocalServerConfig() {
        return {
            serverIP: this.curServerIP,
            serverPort: this.curServerPort,
            websocketPort: this.curWebSocketPort,
            localIPs: LocalServer.getLocalIPs()
        };
    }

    public updateLocalServerConfig(config: { serverIP: string, serverPort: number, websocketPort: number }) {
        this.curServerIP = config.serverIP;
        this.curServerPort = config.serverPort;
        this.curWebSocketPort = config.websocketPort;
    }

    public startLocalServer() {
        try {
            PushService.closeWebSocketServer(() => {
                console.log("关闭本地websocket服务");
            });
            this.httpServer.removeAllListeners();
        } catch (err) {

        }

        PushService.initWebSocket(this.curWebSocketPort);
        this.httpServer.listen(this.curServerPort, () => {
            console.log('CORS-enabled web server listening on port ' + this.curServerPort);
        });
    }
}

export default new LocalServer();