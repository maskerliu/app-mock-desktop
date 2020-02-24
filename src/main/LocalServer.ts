import Url from 'url'
import zlib from 'zlib'
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'

const { ipcMain } = require('electron');
const axios = require("axios");
const compression = require("compression");
const websocket = require("nodejs-websocket");
const JSONBigInt = require("json-bigint");
const interfaces = require('os').networkInterfaces();

const CmdCode = {
    REQUEST: 5001,
    REQUEST_START: 5002,
    REQUEST_END: 5004,
    REGISTER_SUCCESS: 5005,
    STATISTICS: 5008
};

const corsOptions = {
    origin: 'http://localhost:9080',
    credentials: true,
    optionsSuccessStatus: 200
};

let MOCK_TEST_ENABLE: boolean = false;
let PROXY_REQUEST: boolean = true;
let PROXY_STATISTICS: boolean = false;
let PROXY_DELAY: number = 0;
let _sessionId: number = 0;
let curMockConfigId: number = 0;
let curServerPort: number = 0;
let DEFAULT_HEADER = { 'Content-Type': 'text/html' };

const VALID_PATHS = ['register',];
const PROXY_DEF_TIMEOUT = 1000 * 15;	// 15s

ipcMain.on('get-mock-configs', (event: any, args?: any) => {
    event.sender.send('get-mock-configs-reply', {
        // ruleConfig: SqliteFactory.getMockConfigs(),
        mockTestEnable: MOCK_TEST_ENABLE
    })
})

ipcMain.on('save-mock-config', (event, args) => {
    try {
        // SqliteFactory.saveMockConfigs(args.config, args.rules)
        event.sender.send('save-mock-configs-reply', { code: 8000, message: 'mock配置保存成功！' })
    } catch (e) {
        event.sender.send('save-mock-configs-reply', { code: 8010, message: 'mock配置保存失败！' })
    }
})

let Web = {
    filter: (req: any, resp: any) => {
        let url = req.url;
        if (url === '/') {
            // Web.index(req, resp);
            return;
        }

        let props = this.parseUrl(url);
        if (props) {
            if (props.type === 'cgi' && Web[props.path]) {
                Web[props.path].apply(null, [req, resp]);
                return;
            }
        }
        this.error(req, resp);
    },
    register: (req: any, resp: any) => {
        resp.writeHead(200, DEFAULT_HEADER);
        let uid = req.query['uid'];
        if (uid) {
            resp.end();

            let data = {
                code: CmdCode.REGISTER_SUCCESS,
                data: uid
            };
            wsServer.connections[0].sendText(JSON.stringify(data));
        } else {
            resp.end('invalid uid');
        }
    },
    error: (req: any, resp: any) => {
        resp.writeHead(-100, DEFAULT_HEADER);
        resp.send('unknow error');
        resp.end();
    },
    parseUrl: (url: string) => {
        if (/^\/mw\//.test(url)) {
            let path = url.substring(4).split('?')[0];	// remove /mw/
            if (VALID_PATHS.indexOf(path) !== -1) {
                return {
                    path: path,
                    type: 'cgi'
                };
            }
        }
        return null;
    },
    getLocalIp: () => {
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
};

let PushFactory = {
    sendRequestStartMessage: (req: any, sessionId: number) => {
        if (!PROXY_REQUEST) {
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
            code: CmdCode.REQUEST_START,
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
    },
    sendRequestEndMessage: (sessionId: number,
        startTime: number,
        statusCode: number,
        respHeaders: any,
        respData: any,
        isMock: boolean) => {

        if (!PROXY_REQUEST) {
            return;
        }

        let data = {
            code: CmdCode.REQUEST_END,
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

    },
    sendStatisticsMessage: (sessionId: number, statistics: any[]) => {
        if (!PROXY_STATISTICS) {
            return;
        }
        let data = {
            code: CmdCode.STATISTICS,
            data: {
                id: sessionId,
                statistics: statistics
            }
        };
        if (!!wsServer.connections[0]) {
            wsServer.connections[0].sendText(JSON.stringify(data));
        }
    }
};

let ProxyFactory = {
    handleRequest: (req: any, resp: any) => {
        let startTime = new Date().getTime();
        let sessionId = ++_sessionId;
        PushFactory.sendRequestStartMessage(req, sessionId);

        if (curMockConfigId != 0) {
            // let row = SqliteFactory.getMockData(req.url, curMockConfigId)
            // if (!!row && !!row.mock_data) {
            // MockFactory.mockRequestData(req, resp, JSON.parse(row.mock_data), sessionId, startTime);
            // return;
            // }
        }

        if (!MOCK_TEST_ENABLE) {
            ProxyFactory.proxyRequestData(req, resp, sessionId, startTime);
            return;
        }

        this.mockTestData(req, (err: any, testResp: any) => {
            if (err == null && testResp.status == 200 && Object.keys(testResp.data).length != 0) {
                setTimeout(() => {
                    PushFactory.sendRequestEndMessage(sessionId, startTime, testResp.status, testResp.headers, testResp.data, true);
                    resp.send(testResp.data);
                    resp.end();
                }, PROXY_DELAY);
                return;
            }
            ProxyFactory.proxyRequestData(req, resp, sessionId, startTime);
        });
    },
    mockTestData: (req: any, callback: any) => {
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
    },
    proxyRequestData: (req: any, proxyResp: any, sessionId: number, startTime: number) => {
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
                return JSONBigInt.parse(data)
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
            setTimeout(() => {
                PushFactory.sendRequestEndMessage(sessionId, startTime, resp.status, resp.headers, resp.data, false);
                proxyResp.send(resp.data);
                proxyResp.end();
            }, PROXY_DELAY);
        }).catch((err: any) => {
            let resp = err.response;
            if (!!resp) {
                PushFactory.sendRequestEndMessage(sessionId, startTime, -100, resp.headers, resp.data, false);
                proxyResp.send(resp.data);
                proxyResp.end();
            } else {
                PushFactory.sendRequestEndMessage(sessionId, startTime, -100, null, err.message, false);
                proxyResp.send(err.message);
                proxyResp.end();
            }

        });
    }
};

let MockFactory = {
    mockRequestData: (req: any, resp: any, rule: any, sessionId: number, startTime: number) => {
        setTimeout(() => {
            let statusCode = rule.statusCode || 200;
            resp.status(statusCode);
            resp.json(rule.responseData);
            resp.end();
            PushFactory.sendRequestEndMessage(sessionId, startTime, statusCode, rule.responseHeader, rule.responseData, true);
        }, PROXY_DELAY);
    }
};


let app = express();
app.use(cors(corsOptions));
app.use(compression());
app.use((req: any, resp: any, next: any) => {
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

app.post("/burying-point/collect",
    bodyParser.raw({ type: "text/plain" }),
    (req: any, resp: any) => {
        let data = Buffer.from(req.rawbody);
        zlib.unzip(data, (err: any, buffer: any) => {
            if (!err) {
                PushFactory.sendStatisticsMessage(++_sessionId, JSON.parse(buffer.toString()));
            } else {
                console.log(err);
            }
        });
        resp.end();
    });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text({ type: "application/json" }));
app.all('*', (req: any, resp: any, next: any) => {
    if (req.url === '/' || /^\/mw\//.test(req.url) || /^\/burying-point\//.test(req.url)) {
        Web.filter(req, resp);
    } else if (req.url !== '/favicon.ico') {
        ProxyFactory.handleRequest(req, resp);
    } else {
        resp.end();
    }
});

app.listen(curServerPort, () => {
    console.log('CORS-enabled web server listening on port ' + curServerPort);
});

let wsServer = websocket.createServer((conn: any) => {
    conn.on("text", (str: string) => {
        conn.sendText(str)
    });
    conn.on("close", (code: number, reason: any) => {
        console.log("关闭连接")
    });
    conn.on("error", (code: number, reason: any) => {
        console.log("异常关闭")
    });
}).listen(8889);