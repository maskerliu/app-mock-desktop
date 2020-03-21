
import {ipcMain} from "electron"
import Url from "url"
import { Request, Response } from "express"
import * as PushService from "./PushService"
import { mockRequestData } from "./MockService"



const JSONBigInt = require("json-bigint");
const axios = require("axios");

const PROXY_DEF_TIMEOUT = 1000 * 15;	// 15s

let MOCK_TEST_ENABLE: boolean = false;
let PROXY_DELAY: number = 0;
let _sessionId: number = 0;

ipcMain.on("set-delay", (event: any, args?: any) => {
    try {
        if(!args.isDelay) {
            PROXY_DELAY = 0;
        } else {
            PROXY_DELAY = args.delay;
        }
    } catch (err) {

    }
});

export function handleRequest(req: Request, resp: Response) {
    let startTime = new Date().getTime();
    let sessionId = ++_sessionId;
    PushService.sendRequestStartMessage(req, sessionId);

    if (mockRequestData(req, resp, sessionId, startTime, PROXY_DELAY)) return;

    if (!MOCK_TEST_ENABLE) {
        proxyRequestData(req, resp, sessionId, startTime);
        return;
    }

    mockTestData(req, (err: any, testResp: any) => {
        if (err == null && testResp.statusCode == 200 && Object.keys(testResp.data).length != 0) {
            setTimeout(() => {
                PushService.sendRequestEndMessage(sessionId, startTime, testResp.status, testResp.getHeaders(), testResp.data, true);
                resp.send(testResp.data);
                resp.end();
            }, PROXY_DELAY);
            return;
        }
        proxyRequestData(req, resp, sessionId, startTime);
    });
}

function proxyRequestData(req: Request, proxyResp: Response, sessionId: number, startTime: number) {
    let originHost = req.header('host');
    let url = Url.parse(originHost);
    let host = url.host.split(/[:\/]/)[0];
    let port = url.port;
    let protocol = url.protocol;

    let headers = Object.assign({}, req.headers);
    headers.host = protocol + "//" + host;

    delete headers['host'];

    let options = {
        url: protocol + "//" + host + req.path,
        method: req.method,
        headers: headers,
        transformResponse: [(data: any) => {
            try {
                return JSONBigInt.parse(data)
            } catch (err) {
                console.log(data);
                console.log(err);
                return null;
            }
        }],
        timeout: PROXY_DEF_TIMEOUT
    };

    if (JSON.stringify(req.query) !== '{}') {
        options['params'] = req.query;
    }
    if (JSON.stringify(req.body) !== '{}') {
        options['data'] = req.body;
    }

    axios(options).then((resp: any) => {
        try {
            setTimeout(() => {
                PushService.sendRequestEndMessage(sessionId, startTime, resp.status, resp.headers, resp.data, false);
                proxyResp.send(resp.data);
                proxyResp.end();
            }, PROXY_DELAY);
        } catch (err) {
            console.log(err);
        }
    }).catch((err: any) => {
        let resp = err.response;
        if (!!resp) {
            PushService.sendRequestEndMessage(sessionId, startTime, -100, resp.headers, resp.data, false);
            proxyResp.send(resp.data);
            proxyResp.end();
        } else {
            PushService.sendRequestEndMessage(sessionId, startTime, -100, null, err.message, false);
            proxyResp.send(err.message);
            proxyResp.end();
        }

    });
}

function mockTestData(req: Request, callback: Function) {
    let headers = Object.assign({}, req.headers);
    let options = {
        url: "http://10.111.3.51:9001/ujtest/property/getDatasByUrl?url=" + req.path,
        method: "GET",
        transformResponse: [(data: any) => {
            return JSONBigInt.parse(data)
        }],
        timeout: PROXY_DEF_TIMEOUT
    };

    axios(options).then((resp: any) => {
        callback(null, resp);
    }).catch((err: any) => {
        callback(err, null);
    });
}