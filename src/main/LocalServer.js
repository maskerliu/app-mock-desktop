const Url = require('url');
const axios = require("axios");
const bodyParser = require('body-parser');
const compression = require('compression');
const interfaces = require('os').networkInterfaces();
const zlib = require('zlib');
const cors = require('cors');
const path = require('path');
const express = require('express');
const websocket = require("nodejs-websocket");
const {ipcMain} = require('electron');

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


let curServerPort = 8888;
let curMockConfigId = 0;

const DB_URL_PROD = path.resolve(__dirname, '../../../../AppMock.db');
const DB_URL_BETA = "AppMock.db";
let dbPath = process.env.NODE_ENV === 'development' ? DB_URL_BETA : DB_URL_PROD;
const Database = require('better-sqlite3');
const db = new Database(dbPath);
let SqliteFactory = {
    initDB: function () {
        try {
            db.prepare('select id from AppMockPref limit 1').get();
        } catch (e) {
            db.prepare('create table AppMockPref' +
                '(' +
                '  id     INTEGER  not null primary key autoincrement,' +
                '  name   char(48) not null,' +
                '  value  char(48) ' +
                ')').run();
        }

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
    },
    initApp: function () {
        try {
            let row = db.prepare('select id from AppMockConfig where `status` = 1').get();
            curMockConfigId = row === undefined ? 0 : row.id;
        } catch (e) {
            curMockConfigId = 0;
        }

        try {
            let row = db.prepare('select value from AppMockPref where `name` = "customPort"').get();
            curServerPort = row === undefined ? 8888 : parseInt(row.value);
        } catch (e) {
            db.prepare('insert into AppMockPref (`name`, `value`) value(?, ?)').run("customePort", "8888");
            curServerPort = 8888;
        }
    }
};

SqliteFactory.initDB();
SqliteFactory.initApp();

ipcMain.on('port-setting-save', (event, args) => {
    if (!!!args.customPort) {
        return;
    }
    let result = db.prepare('select `value` from AppMockPref where `name`=?').get('customPort');
    if (result) {
        db.prepare('update AppMockPref set `value`= ? where `name` = ?').run(args.customPort, 'customPort');
    } else {
        db.prepare('insert into AppMockPref(`name`, `value`) values(?, ?)').run('customPort', args.customPort);
    }

});

ipcMain.on('reset', (event, args) => {
    let result = {};
    try {
        db.prepare('delete from AppMockConfig').run();
        db.prepare('delete from MockRule').run();
        db.prepare('update sqlite_sequence set seq=0').run();
        result = {color: 'success', msg: '重置成功'};
    } catch (e) {
        result = {color: 'red500', msg: '重置失败'};
    }
    event.sender.send('reset-reply', result);
});

ipcMain.on('get-local-server', (event) => {

    let result = {
        customPort: curServerPort,
        registerIp: Web.getLocalIp()
    };

    event.sender.send('get-local-server-reply', result);
});

ipcMain.on('get-mock-configs', (event, args) => {
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

    event.sender.send('get-mock-configs-reply', configs);
});

ipcMain.on('save-mock-config', (event, args) => {
    try {
        let config = args.config;
        let rules = args.rules;

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
        event.sender.send('save-mock-configs-reply', {color: 'success', msg: 'mock配置保存成功！'});
    } catch (e) {
        event.sender.send('save-mock-configs-reply', {color: 'red', msg: 'mock配置保存失败！'});
    }
});

ipcMain.on('get-mock-rules', (event, args) => {
    try {
        const rows = db.prepare('select * from MockRule where config_id = ?').all(args.configId);
        let rules = {};
        rows.forEach(item => {
            rules[item.path] = {id: item.id, configId: item.config_id, path: item.path, mockData: item.mock_data};
        });

        event.sender.send('get-mock-rules-reply', rules);
    } catch (e) {

    }
});

ipcMain.on('set-mock-config', (event, args) => {
    try {
        let status = args.status;
        let configId = args.configId;
        if (!!configId) {
            db.prepare('update AppMockConfig set `status` = ?').run(0);
            if (status) {
                curMockConfigId = configId;
                db.prepare('update AppMockConfig set `status`= ? where id = ?').run(1, configId);
            } else {
                let row = db.prepare('select id from AppMockConfig where `status`= 1').get();
                curMockConfigId = row === undefined ? 0 : row.id;
            }
        }
        event.sender.send('set-mock-config-reply', {color: 'success', msg: 'mock配置成功'});
    } catch (e) {
        event.sender.send('del-mock-config-reply', {color: 'red', msg: '配置发生错误！'});
    }
});

ipcMain.on('del-mock-config', (event, args) => {
    try {
        let configId = args.configId;
        const deleteMockConfig = db.prepare('delete from AppMockConfig where id = (?)');
        const deleteMockRules = db.prepare('delete from MockRule where config_id = (?)');
        deleteMockConfig.run(configId);
        deleteMockRules.run(configId);
        event.sender.send('del-mock-config-reply', {color: 'primary', msg: '成功删除配置！'});
    } catch (e) {
        event.sender.send('del-mock-config-reply', {color: 'red', msg: '删除配置发生错误！'});
    }
});

ipcMain.on('set-proxy-request', (event, args) => {
    PROXY_REQUEST = args.proxyRequest;
});

ipcMain.on('set-proxy-statistics', (event, args) => {
    PROXY_STATISTICS = args.proxyStatistics;
});

ipcMain.on('set-proxy-delay', (event, args) => {
    PROXY_DELAY = args.delay;
});

let PROXY_REQUEST = true;
let PROXY_STATISTICS = false;
let PROXY_DELAY = 0;
let _sessionId = 0;
const PROXY_DEF_TIMEOUT = 1000 * 15;	// 15s
const VALID_PATHS = ['getIp', 'register',];

let DEFAULT_HEADER = {'Content-Type': 'text/html'};

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
        resp.json({ip: Web.getLocalIp() + ":" + curServerPort, path: `${__dirname}`});
        resp.end();
    },
    register: function (req, resp) {
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
    statistic: function (req, resp) {
        let data = Buffer.from(req.rawbody);
        zlib.unzip(data, (err, buffer) => {
            if (!err) {
                PushFactory.sendStatisticsMessage(++_sessionId, JSON.parse(buffer.toString()));
            } else {
                console.log(err);
            }
        });
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
        } else if (url === '/burying-point/collect') {
            return {
                path: 'statistic',
                type: 'cgi'
            };
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

let PushFactory = {
    sendRequestStartMessage: function (req, sessionId) {
        if (!PROXY_REQUEST) {
            return;
        }

        let reqUrl = Url.parse(req.header("host"));
        let requestData = null;
        if (req.method === 'GET') {
            requestData = !!req.query ? req.query : null;
        } else {
            requestData = !!req.body ? req.body : null;
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

        wsServer.connections[0].sendText(JSON.stringify(data));
    },
    sendRequestEndMessage: function (sessionId, startTime, statusCode, respHeaders, respData, isMock) {
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
                time: new Date().getTime() - startTime + parseInt(PROXY_DELAY),
                mock: isMock,
            }
        };
        wsServer.connections[0].sendText(JSON.stringify(data));
    },
    sendStatisticsMessage: function (sessionId, statistics) {
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
        wsServer.connections[0].sendText(JSON.stringify(data));
    }
};

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

            setTimeout(function () {
                proxyResp.send(resp.data);
                proxyResp.end();
            }, PROXY_DELAY);
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

let MockFactory = {
    mockRequestData: function (req, resp, rule, sessionId, startTime) {
        let statusCode = rule.statusCode || 200;
        resp.status(statusCode);
        resp.json(rule.responseData);
        resp.end();
        PushFactory.sendRequestEndMessage(sessionId, startTime, statusCode, rule.responseHeader, rule.responseData, true);

    }
};

let app = express();
app.use(cors(corsOptions));
app.use(compression());
app.use(function (req, res, next) {
    if (req.url === '/burying-point/collect') {
        let buf = [];
        req.on('data', function (data) {
            buf.push(data);
        });
        req.on('end', function () {
            req.rawbody = Buffer.concat(buf);
        });
    }
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: false}));
app.all('*', function (req, res, next) {
    if (req.url === '/' || /^\/mw\//.test(req.url) || /^\/burying-point\//.test(req.url)) {
        Web.filter(req, res);
    } else if (req.url !== '/favicon.ico') {
        ProxyFactory.handleRequest(req, res);
    } else {
        res.end();
    }
});

app.listen(curServerPort, function () {
    console.log('CORS-enabled web server listening on port ' + curServerPort);
});

let wsServer = websocket.createServer(function (conn) {
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
