import { ipcMain } from "electron"
import compression from "compression"
import zlib from "zlib"
import cors from "cors"
import express, { Application, Request, Response } from "express"
import bodyParser from "body-parser"

import * as WebService from "./WebService"
import * as PushService from "./PushService"
import * as ProxyService from "./ProxyService"
import * as MockService from "./MockService"

const interfaces = require("os").networkInterfaces();

const corsOptions = {
    origin: 'http://localhost:9080',
    credentials: true,
    optionsSuccessStatus: 200
};

let _sessionId: number = 0;
let curServerIP: string = getDefaultLocalIP();
let curServerPort: number = 8888;
let curWebSocketPort: number = 8889;


function getLocalIPs(): Array<string> {
    let ips = [];

    for (let devName in interfaces) {
        let iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            let alias = iface[i];
            alias.name = devName;
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                ips.push(alias);
            }
        }
    }
    return ips;
}

function getDefaultLocalIP() {
    let tempAddress = "127.0.0.1";
    for (let devName in interfaces) {
        let iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            let alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                if (new RegExp("^192.168").test(alias.address)) {
                    return alias.address;
                }
                tempAddress = alias.address;
            }
        }
    }
    return tempAddress;
}

const httpServer: Application = express();
httpServer.use(cors(corsOptions));
httpServer.use(compression());
httpServer.use((req: any, resp: Response, next: any) => {
    if (req.url === '/burying-point/collect') {
        let buf = [];
        req.on('data', (data: any) => {
            buf.push(data);
        });
        req.on('end', () => {
            req.rawbody = Buffer.concat(buf);
        });
    }
    next();
});

httpServer.post("/burying-point/collect", bodyParser.raw({ type: "text/plain" }), (req: any, resp: any) => {
    let data = Buffer.from(req.rawbody);
    zlib.unzip(data, (err: any, buffer: any) => {
        if (!err) {
            PushService.sendStatisticsMessage(++_sessionId, JSON.parse(buffer.toString()));
        } else {
            console.log(err);
        }
    });
    resp.end();
});

httpServer.use(bodyParser.urlencoded({ extended: true }));
httpServer.use(bodyParser.text({ type: "application/json" }));
httpServer.all('*', (req: Request, resp: Response, next: any) => {
    if (req.url === '/' || /^\/appmock\//.test(req.url) || /^\/burying-point\//.test(req.url)) {
        WebService.filter(req, resp);
    } else if (req.url !== '/favicon.ico') {
        ProxyService.handleRequest(req, resp);
    } else {
        resp.end();
    }
});


function startLocalServer() {
    try {
        PushService.closeWebSocketServer(() => {
            console.log("关闭本地websocket服务");
        });
        httpServer.removeAllListeners();
    } catch(err) {

    }

    MockService.initDB();
    PushService.initWebSocket(curWebSocketPort);
    httpServer.listen(curServerPort, () => {
        console.log('CORS-enabled web server listening on port ' + curServerPort);
    });
}


ipcMain.on('get-local-server-config', (event: any, args?: any) => {
    let result = {
        serverIP: curServerIP,
        serverPort: curServerPort,
        websocketPort: curWebSocketPort,
        localIPs: getLocalIPs()
    };
    event.sender.send('get-local-server-config', result);
});

ipcMain.on('update-local-server-config', (event: any, args?: any) => {
    try {
        curServerIP = args.serverIP;
        curServerPort = args.serverPort;
        curWebSocketPort = args.websocketPort;

        startLocalServer();
    } catch (err) {

    }

    let result = {
        serverIP: curServerIP,
        serverPort: curServerPort,
        websocketPort: curWebSocketPort,
        localIPs: getLocalIPs()
    };
    event.sender.send('get-local-server-config', result);
});


startLocalServer();