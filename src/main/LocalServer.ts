import {ipcMain} from "electron"
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
let curServerPort: number = 8888;

MockService.initDB();

function getLocalIp() {
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

ipcMain.on('get-local-server-config', (event: any, args?: any) => {
    let result = {
        customPort: curServerPort,
        registerIp: getLocalIp()
    };

    event.sender.send('get-local-server-config', result);
});

ipcMain.on('get-mock-configs', (event: any, args?: any) => {

});

ipcMain.on('save-mock-config', (event: any, args?: any) => {
    try {
        event.sender.send('save-mock-configs-reply', { code: 8000, message: 'mock配置保存成功！' })
    } catch (e) {
        event.sender.send('save-mock-configs-reply', { code: 8010, message: 'mock配置保存失败！' })
    }
});




const app: Application = express();
app.use(cors(corsOptions));
app.use(compression());
app.use((req: any, resp: Response, next: any) => {
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

app.post("/burying-point/collect", bodyParser.raw({ type: "text/plain" }), (req: any, resp: any) => {
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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text({ type: "application/json" }));
app.all('*', (req: Request, resp: Response, next: any) => {
    if (req.url === '/' || /^\/appmock\//.test(req.url) || /^\/burying-point\//.test(req.url)) {
        WebService.filter(req, resp);
    } else if (req.url !== '/favicon.ico') {
        ProxyService.handleRequest(req, resp);
    } else {
        resp.end();
    }
});

app.listen(curServerPort, () => {
    console.log('CORS-enabled web server listening on port ' + curServerPort);
});