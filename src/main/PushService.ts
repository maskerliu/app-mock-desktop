import Url from "url"
import { Request, Response } from "express"

import { CMDCode } from "../model/DataModels"

const JSONBigInt = require("json-bigint");
const websocket = require("nodejs-websocket");


let IS_PROXY_REQUEST: boolean = true;
let IS_PROXY_STATISTICS: boolean = false;

let wsServer = null;

export function initWebSocket(port: number): void {
    wsServer = websocket.createServer((conn: any) => {
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
        console.log("启动本地websoket服务");
    });
}

export function closeWebSocketServer(callback: any): void {
    if (wsServer != null) {
        wsServer.close(callback);
    }
}

export function sendMessage(data: any) {
    wsServer.connections[0].sendText(JSON.stringify(data));
}

export function sendRequestStartMessage(req: Request, sessionId: number) {
    if (!IS_PROXY_REQUEST) {
        return;
    }

    let reqUrl = Url.parse(req.header("host"));
    let requestData = null;
    if (req.method === 'GET') {
        requestData = !!req.query ? req.query : null;
    } else {
        requestData = !!req.body ? JSONBigInt.parse(req.body) : null;
    }

    let data = {
        code: CMDCode.REQUEST_START,
        data: {
            id: sessionId,
            url: req.url,
            method: req.method,
            headers: req.headers,
            proxyport: reqUrl.port,
            requestData: requestData
        }
    };
    if (!!wsServer.connections[0]) {
        wsServer.connections[0].sendText(JSON.stringify(data));
    }
}

export function sendRequestEndMessage(sessionId: number,
    startTime: number,
    statusCode: number,
    respHeaders: any,
    respData: any,
    isMock: boolean) {

    if (!IS_PROXY_REQUEST) {
        return;
    }

    let data = {
        code: CMDCode.REQUEST_END,
        data: {
            id: sessionId,
            statusCode: statusCode,
            headers: !!respHeaders ? respHeaders : null,
            responseData: !!respData ? JSON.stringify(respData) : null,
            time: new Date().getTime() - startTime,
            isMock: isMock,
        }
    };
    if (!!wsServer.connections[0]) {
        wsServer.connections[0].sendText(JSON.stringify(data));
    }
}

export function sendStatisticsMessage(sessionId: number, statistics: any[]) {
    if (!IS_PROXY_STATISTICS) {
        return;
    }
    let data = {
        code: CMDCode.STATISTICS,
        data: {
            id: sessionId,
            statistics: statistics
        }
    };
    if (!!wsServer.connections[0]) {
        wsServer.connections[0].sendText(JSON.stringify(data));
    }
}