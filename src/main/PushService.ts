import Url from 'url'
import { CMDCode } from '../model/DataModels';

const websocket = require("nodejs-websocket");


let IS_PROXY_REQUEST: boolean = true;
let IS_PROXY_STATISTICS: boolean = false;

let wsServer = websocket.createServer((conn: any) => {
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
}).listen(8889);

export function sendMessage(data: any) {
    wsServer.connections[0].sendText(JSON.stringify(data));
}

export function sendRequestStartMessage(req: any, sessionId: number) {
    if (!IS_PROXY_REQUEST) {
        return;
    }

    let reqUrl = Url.parse(req.header("host"));
    let requestData = null;
    if (req.method === 'GET') {
        requestData = !!req.query ? req.query : null;
    } else {
        requestData = !!req.body ? JSON.parse(req.body) : null;
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
            mock: isMock,
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