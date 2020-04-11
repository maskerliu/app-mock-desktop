import Url from "url"
import { Request, Response } from "express"

import { CMDCode } from "../model/DataModels"

const JSONBigInt = require("json-bigint");
const websocket = require("nodejs-websocket");


class PushService {
    private isProxyRequest: boolean = true;
    private isProxyStatistics: boolean = false;
    private wsServer: any = null;

    constructor() {
        this.isProxyRequest = true;
        this.isProxyStatistics = false;
    }

    public initWebSocket(port: number): void {
        this.wsServer = websocket.createServer((conn: any) => {
            conn.on("text", (str: string) => {
                conn.sendText(str);
            });
            conn.on("close", (code: number, reason: any) => {
                console.log("关闭连接");
            });
            conn.on('connect', function (code: number) {
                console.log('开启连接', code);
            })
            conn.on("error", (code: number, reason: any) => {
                console.log("异常关闭");
            });
        }).listen(port, () => {
            console.log(`启动本地websoket服务[${port}]`);
        });
    }

    public closeWebSocketServer(callback: any): void {
        if (this.wsServer != null) {
            this.wsServer.close(callback);
        }
    }

    public sendMessage(data: any) {
        this.wsServer.connections[0].sendText(JSON.stringify(data));
    }

    public sendRequestStartMessage(req: Request, sessionId: number) {
        if (!this.isProxyRequest) {
            return;
        }

        let reqUrl = Url.parse(req.header("host"));
        let requestData = null;
        if (req.method === "GET") {
            requestData = !!req.query ? req.query : null;
        } else {
            requestData = !!req.body ? JSONBigInt.parse(req.body) : null;
        }

        let data = {
            id: sessionId,
            type: CMDCode.REQUEST_START,
            url: req.url,
            method: req.method,
            headers: req.headers,
            proxyport: reqUrl.port,
            requestData: requestData
        };
        if (!!this.wsServer.connections[0]) {
            this.wsServer.connections[0].sendText(JSON.stringify(data));
        }
    }

    public sendRequestEndMessage(sessionId: number,
        startTime: number,
        statusCode: number,
        respHeaders: any,
        respData: any,
        isMock: boolean) {

        if (!this.isProxyRequest) {
            return;
        }

        let data = {
            id: sessionId,
            type: CMDCode.REQUEST_END,
            statusCode: statusCode,
            headers: !!respHeaders ? respHeaders : null,
            responseData: !!respData ? JSON.stringify(respData) : null,
            time: new Date().getTime() - startTime,
            isMock: isMock,
        };
        if (!!this.wsServer.connections[0]) {
            this.wsServer.connections[0].sendText(JSON.stringify(data));
        }
    }

    public sendStatisticsMessage(sessionId: number, statistics: any[]) {
        if (!this.isProxyStatistics) {
            return;
        }
        let data = {
            id: sessionId,
            type: CMDCode.STATISTICS,
            statistics: statistics
        };
        if (!!this.wsServer.connections[0]) {
            this.wsServer.connections[0].sendText(JSON.stringify(data));
        }
    }

}

export default new PushService();