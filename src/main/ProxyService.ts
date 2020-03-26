
import { Request, Response } from "express";
import Url from "url";
import MockService from "./MockService";
import PushService from "./PushService";


const JSONBigInt = require("json-bigint");
const axios = require("axios");


class ProxyService {
    private static PROXY_DEF_TIMEOUT: number = 1000 * 15;	// 15s
    private _sessionId: number;
    private proxyDealy: number;

    constructor() {
        this._sessionId = 0;
    }

    public handleRequest(req: Request, resp: Response) {
        let startTime = new Date().getTime();
        let sessionId = ++this._sessionId;
        PushService.sendRequestStartMessage(req, sessionId);

        if (MockService.mockRequestData(sessionId, req, resp, startTime, this.proxyDealy)) return;
        this.proxyRequestData(sessionId, req, resp, startTime);
    }

    private proxyRequestData(sessionId: number, req: Request, proxyResp: Response, startTime: number) {
        let originHost = req.header('host');
        let url = Url.parse(originHost);
        let host = url.host.split(/[:\/]/)[0];
        let port = url.port;
        let protocol = url.protocol;

        let headers = Object.assign({}, req.headers);
        headers.host = protocol + "//" + host;

        delete headers["host"];

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
            timeout: ProxyService.PROXY_DEF_TIMEOUT
        };

        if (JSON.stringify(req.query) !== "{}") {
            options['params'] = req.query;
        }
        if (JSON.stringify(req.body) !== "{}") {
            options['data'] = req.body;
        }

        axios(options).then((resp: any) => {
            try {
                setTimeout(() => {
                    PushService.sendRequestEndMessage(sessionId, startTime, resp.status, resp.headers, resp.data, false);
                    proxyResp.send(resp.data);
                    proxyResp.end();
                }, this.proxyDealy);
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
}

export default new ProxyService();