let Url = require('url');
let axios = require("axios");
let bodyParser = require('body-parser');
let interfaces = require('os').networkInterfaces();
let cors = require('cors');
let express = require('express');

let ErrorCode = {
    EMPTY_COOKIE: 1001
};

let cmd = 5000;
const CmdCode = {
    SET_COOKIE: ++cmd,
    REQUEST_START: ++cmd,
    REQUEST_DATA_COMPLETE: ++cmd,
    REQUEST_END: ++cmd,
    REGISTER_SUCCESS: ++cmd,
    SET_MOCK_CONFIG: ++cmd,
    SET_WS_UID: ++cmd,
};

const corsOptions = {
    origin: 'http://localhost:9080',
    credentials: true,
    optionsSuccessStatus: 200
};

let app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.all('*', function (req, res, next) {
    if (req.url === '/' || /^\/mw\//.test(req.url)) {
        Web.filter(req, res);
    } else if (req.url !== '/favicon.ico') {
        ProxyFactory.handleRequest(req, res);
    } else {
        res.end();
    }
});
app.listen(8888, function () {
    console.log('CORS-enabled web server listening on port 8888')
});


let ws = require("nodejs-websocket");
let wsServer = ws.createServer(function (conn) {
    conn.on("text", function (str) {
        conn.sendText(str)
    });
    conn.on("close", function (code, reason) {
        console.log("关闭连接")
    });
    conn.on("error", function (code, reason) {
        console.log("异常关闭")
    });
}).listen(8889);


const path = require('path');
const DB_URL_PROD = path.resolve(__dirname, '../../../../AppMock.db');
const DB_URL_BETA = "AppMock.db";
let dbPath = process.env.NODE_ENV === 'development' ? DB_URL_BETA : DB_URL_PROD;
const Database = require('better-sqlite3');
console.log(process.env.NODE_ENV);
console.log(dbPath);
// const db = new Database('AppMock.db', {verbose: console.log});
const db = new Database(dbPath);
let SqliteFactory = {
    initDB: function () {

        try {
            db.prepare('select id from AppMockConfig limit 1').get();
        } catch (e) {
            db.prepare('create table AppMockConfig' +
                '(' +
                '  id     INTEGER  not null primary key autoincrement,' +
                '  name   char(48) not null,' +
                '  status boolean default false' +
                ')').run();
        }

        try {
            db.prepare('select id from MockRule limit 1').get();
        } catch (e) {
            db.prepare('create table MockRule' +
                '(' +
                '  id        INTEGER   not null primary key autoincrement,' +
                '  config_id INTEGER   not null,' +
                '  path      char(128) not null,' +
                '  mock_data blob' +
                ')').run();
        }
    }
};

SqliteFactory.initDB();

let curMockConfigId = 0;
try {
    let row = db.prepare('select id from AppMockConfig where `status` = 1').get();
    curMockConfigId = row === undefined ? 0 : row.id;
} catch (e) {
    curMockConfigId = 0;
}

let PushFactory = {
    sendRequestStartMessage: function (req, sessionId) {
        let reqUrl = Url.parse(req.header("host"));
        let requestData = null;
        if (req.method === 'GET') {
            requestData = !!req.query ? req.query : null;
        } else {
            requestData = !!req.body ? req.body : null;
        }

        wsServer.connections.forEach(function (connection) {
            connection.sendText(JSON.stringify({
                code: CmdCode.REQUEST_START,
                data: {
                    id: sessionId,
                    url: req.url,
                    method: req.method,
                    headers: req.headers,
                    proxyport: reqUrl.port,
                    requestData: requestData
                }
            }));
        });
    },
    sendRequestEndMessage: function (sessionId, startTime, statusCode, respHeaders, respData, isMock) {
        wsServer.connections.forEach(function (conn) {
            conn.sendText(JSON.stringify({
                code: CmdCode.REQUEST_END,
                data: {
                    id: sessionId,
                    statusCode: statusCode,
                    headers: !!respHeaders ? respHeaders : null,
                    responseData: !!respData ? JSON.stringify(respData) : null,
                    time: new Date().getTime() - startTime,
                    mock: isMock
                }
            }));
        });
    },
};

const VALID_PATHS = ['getIp', 'register', 'reset', 'getMockConfigs', 'saveMockConfig', 'getMockRules', 'setMockConfig', 'deleteMockConfig'];
let Web = {
    filter: function (req, resp) {
        let url = req.url;
        if (url === '/') {
            Web.index(req, resp);
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
    getIp: function (req, resp) {
        resp.json({ip: Web.getLocalIp() + ":" + 8888, path: `${__dirname}`});
        resp.end();
    },
    register: function (req, resp) {
        resp.writeHead(200, DEFAULT_HEADER);
        let uid = req.query['uid'];
        if (uid) {
            resp.end();
            wsServer.connections.forEach(function (connection) {
                connection.sendText(JSON.stringify({
                    code: CmdCode.REGISTER_SUCCESS,
                    data: uid
                }));
            });
        } else {
            resp.end('invalid uid');
        }
    },
    reset: function (req, resp) {
        let result = {};
        try {
            db.prepare('delete from AppMockConfig').run();
            db.prepare('delete from MockRule').run();
            db.prepare('update sqlite_sequence set seq=0').run();
            result = {
                msg: '重置成功',
                color: 'success'
            };
        } catch (e) {
            result = {
                msg: '重置失败',
                color: 'red500'
            };
        }
        resp.json(result);
        resp.end();
    },
    getMockConfigs: function (req, resp) {
        const stmt = db.prepare('SELECT * FROM AppMockConfig');
        let configs = [];
        let i = 0;
        for (let row of stmt.iterate()) {
            configs[i] = {
                id: row.id,
                name: row.name,
                status: row.status
            };
            i++;
        }

        resp.json(configs);
        resp.end();
    },
    saveMockConfig: function (req, resp) {
        let config = req.body.config;
        let rules = req.body.rules;

        const insertMockConfig = db.prepare('insert into AppMockConfig(name) values (?)');
        const getCurMockConfig = db.prepare("select id from AppMockConfig order by id desc limit 0,1");
        const updateMockRule = db.prepare('update MockRule set mock_data = ? where id = ?');
        const insertMockRule = db.prepare('insert into MockRule(config_id, path, mock_data) values(@configId, @path, @mockData)');
        const findOldMockRules = db.prepare('select id from MockRule where config_id = ?');
        const deleteOldMockRule = db.prepare('delete from MockRule where id = ?');

        if (!!config.id) {
            let rows = findOldMockRules.all(config.id);
            let ids = [];
            rows.forEach(item => {
                ids.push(item.id);
            });

            for (let key in rules) {
                let rule = rules[key];
                if (!!rule.id) {
                    let idx = Web.findPosition(ids, rule.id);
                    if (idx !== -1) {
                        ids.splice(idx, 1);
                    }
                    updateMockRule.run(JSON.stringify(rule.mockData), rule.id);
                } else {
                    insertMockRule.run({
                        configId: rule.configId,
                        path: rule.path,
                        mockData: JSON.stringify(rule.mockData)
                    });
                }
            }

            if (!!ids) {
                ids.forEach(item => {
                    deleteOldMockRule.run(item);
                })
            }
        } else {
            insertMockConfig.run(config.name);
            let id = getCurMockConfig.get().id;
            const insertMany = db.transaction((mockRules) => {
                for (let key in mockRules) {
                    let rule = mockRules[key];
                    rule.configId = id;
                    insertMockRule.run({
                        configId: rule.configId,
                        path: rule.path,
                        mockData: JSON.stringify(rule.mockData)
                    });
                }
            });
            insertMany(rules);
        }

        resp.json({
            msg: 'mock配置保存成功！',
            color: 'success'
        });
        resp.end();
    },
    getMockRules: function (req, resp) {
        const rows = db.prepare('select * from MockRule where config_id = ?').all(req.body.configId);
        let rules = {};
        rows.forEach(item => {
            rules[item.path] = {id: item.id, configId: item.config_id, path: item.path, mockData: item.mock_data};
        });

        resp.json(rules);
        resp.end();
    },
    setMockConfig: function (req, resp) {
        let status = req.body.status;
        let configId = req.body.configId;
        if (!!configId) {
            db.prepare('update AppMockConfig set `status` = ?').run(0);
            if (status) {
                curMockConfigId = configId;
                db.prepare('update AppMockConfig set `status`= ? where id = ?').run(1, req.body.configId);
            } else {
                let row = db.prepare('select id from AppMockConfig where `status`= 1').get();
                curMockConfigId = row === undefined ? 0 : row.id;
            }
        }
        resp.json({
            msg: 'mock配置成功',
            color: 'success'
        });
        resp.end();
    },
    deleteMockConfig: function (req, resp) {
        try {
            let configId = req.body.configId;
            const deleteMockConfig = db.prepare('delete from AppMockConfig where id = (?)');
            const deleteMockRules = db.prepare('delete from MockRule where config_id = (?)');
            deleteMockConfig.run(configId);
            deleteMockRules.run(configId);
            resp.json({color: 'primary', msg: '成功删除配置！'});
        } catch (e) {
            resp.json({color: 'red', msg: '删除配置发生错误！'});
        }
        resp.end();
    },
    error: function (req, resp) {
        resp.writeHead(-100, DEFAULT_HEADER);
        resp.send('unknow error');
        resp.end();
    },
    parseUrl: function (url) {
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
    getLocalIp: function () {
        for (let devName in interfaces) {
            let iface = interfaces[devName];
            for (let i = 0; i < iface.length; i++) {
                let alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
    },
    findPosition: function (arr, val) {
        let idx = -1;
        if (!!arr) {
            for (let i = 0; i < arr.length; ++i) {
                if (arr[i] === val) {
                    idx = i;
                    break;
                }
            }
        }
        return idx;
    }
};

let _sessionId = 0;
const PROXY_DEF_TIMEOUT = 1000 * 15;	// 15s
let ProxyFactory = {
    handleRequest: function (req, resp) {
        let startTime = new Date().getTime();
        let sessionId = ++_sessionId;
        PushFactory.sendRequestStartMessage(req, sessionId);

        if (curMockConfigId === 0) {
            this.proxyRequestData(req, resp, sessionId, startTime);
        } else {
            const row = db.prepare('SELECT mock_data FROM MockRule where path = ? and config_id = ?').get(req.url, curMockConfigId);
            if (!!row && !!row.mock_data) {
                MockFactory.mockRequestData(req, resp, JSON.parse(row.mock_data), sessionId, startTime);
            } else {
                this.proxyRequestData(req, resp, sessionId, startTime);
            }
        }
    },
    proxyRequestData: function (req, proxyResp, sessionId, startTime) {
        let originHost = req.header('host');
        let url = Url.parse(originHost);
        let host = url.host.split(/[:\/]/)[0];
        let port = url.port;
        let protocol = url.protocol;
        // console.log('origin host:' + originHost);
        // console.log('port: ' + port);
        // console.log('protocol: ' + protocol);
        // console.log('after host:' + protocol + host);
        let headers = Object.assign({}, req.headers);
        headers.host = protocol + "//" + host;
        // console.log("url: " + protocol + "//" + host + req.path);
        // console.log("req query: " + JSON.stringify(req.query));
        // console.log("req headers: " + JSON.stringify(headers));
        // console.log("req data: " + JSON.stringify(req.body));
        // console.log('start proxy request:[%s]', protocol + "//" + host + req.url);

        delete headers['host'];

        let options = {
            url: protocol + "//" + host + req.path,
            method: req.method,
            headers: headers,
            timeout: PROXY_DEF_TIMEOUT
        };

        if (JSON.stringify(req.query) !== '{}') {
            options['params'] = req.query;
        }
        if (JSON.stringify(req.body) !== '{}') {
            options['data'] = req.body;
        }
        axios(options).then(resp => {
            PushFactory.sendRequestEndMessage(sessionId, startTime, resp.status, resp.headers, resp.data, false);
            proxyResp.send(resp.data);
            proxyResp.end();
        }).catch(err => {
            // console.log("err: " + err.code);
            // console.log("err:" + err.message);
            // console.log("err: " + err.response);
            let resp = err.response;
            if (!!resp) {
                // console.log("err: " + JSON.stringify(err.response.headers));
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

let DEFAULT_HEADER = {'Content-Type': 'text/html'};
let MockFactory = {
    mockRequestData: function (req, resp, rule, sessionId, startTime) {
        let statusCode = rule.statusCode || 200;
        resp.status(statusCode);
        resp.json(rule.responseData);
        resp.end();
        PushFactory.sendRequestEndMessage(sessionId, startTime, statusCode, rule.responseHeader, rule.responseData, true);

    }
};
