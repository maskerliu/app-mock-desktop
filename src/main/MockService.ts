
import path from "path"
import { app } from "electron";
import { Request, Response } from "express"
import PouchDB from "pouchdb"
import PouchDBFind from "pouchdb-find"

import * as PushService from "./PushService"
import { MockRule, ProxyRequestRecord, BizResponse, Paged, BizCode } from "../model/DataModels"

let PROXY_DELAY = 0;
PouchDB.plugin(PouchDBFind);
let localDB: any;

export function mockRequestData(req: Request, resp: Response, record: ProxyRequestRecord, sessionId: number, startTime: number) {
    setTimeout(() => {
        let statusCode: number = record.statusCode || 200;
        resp.status(statusCode);
        resp.json(record.responseData);
        resp.end();
        PushService.sendRequestEndMessage(sessionId, startTime, statusCode, record.responseHeaders, record.responseData, true);
    }, PROXY_DELAY);
}


export function initDB() {
    console.log(app.getPath('userData'));
    localDB = new PouchDB(path.join(app.getPath('userData'), 'AppMockDB'));
    localDB.createIndex({
        index: {
            fields: ['name']
        }
    }).then((result: any) => {
        console.log(result);
    }).catch((err: any) => {
        console.log(err);
    });
}

export function getPagedMockRules(req: Request, resp: Response) {
    let startkey: number = req.query['startkey'];
    let bizResp: BizResponse<Paged<MockRule>> = new BizResponse<Paged<MockRule>>();
    localDB.allDocs({
        include_docs: true,
        attachments: false,
        startkey: startkey,
        sort: ['name']
    }).then((result: any) => {
        let rules: Array<MockRule> = [];
        for (let i: number = 0; i < result.rows.length; ++i) {
            try {
                let rule: MockRule = result.rows[i].doc;
                rules.push(rule);
            } catch (err) {
                console.error(err);
            }
        }
        let paged: Paged<MockRule> = new Paged<MockRule>();
        paged.data = rules;
        paged.page = rules[rules.length - 1]._id;
        paged.totalPage = result.total_rows;
        bizResp.code = BizCode.SUCCESS;
        bizResp.data = paged;

        resp.json(bizResp);
        resp.end();
    }).catch((error: any) => {
        bizResp.code = BizCode.ERROR;
        bizResp.msg = error;
        resp.json(bizResp);
        resp.end();
    });
}

export function searchMockRules(req: Request, resp: Response) {
    let keyword: string = req.query['keyword'];
    let bizResp: BizResponse<Array<MockRule>> = new BizResponse<Array<MockRule>>();
    localDB.find({
        selector: { name: { $regex: new RegExp(`${keyword}`) } },
    }).then((result: any) => {
        let rules: Array<MockRule> = [];
        for (let i: number = 0; i < result.docs.length; ++i) {
            try {
                let rule: MockRule = result.docs[i];
                rules.push(rule);
            } catch (err) {
                console.error(err);
            }
        }
        bizResp.code = BizCode.SUCCESS;
        bizResp.data = rules;
        resp.json(bizResp);
        resp.end();
    }).catch((err: any) => {
        bizResp.code = BizCode.ERROR;
        bizResp.msg = err;
        resp.json(bizResp);
        resp.end();
    });

}

export function getMockRuleDetail(req: Request, resp: Response) {
    let ruleId: string = req.query['ruleId'];
    let bizResp: BizResponse<Array<MockRule>> = new BizResponse<Array<MockRule>>();
    localDB.get(ruleId, { attachments: true }).then((result: any) => {
        bizResp.code = BizCode.SUCCESS;
        bizResp.data = result;
        resp.json(bizResp);
        resp.end();
    }).catch((err: any) => {
        bizResp.code = BizCode.ERROR;
        bizResp.msg = err;
        resp.json(bizResp);
        resp.end();
    });
}

// add or update mock rule
export function saveMockRule(req: Request, resp: Response) {
    let rule: MockRule = JSON.parse(req.body);
    let bizResp: BizResponse<string> = new BizResponse<string>();
    if (rule._id === null || rule._id === undefined) {
        localDB.post(rule).then((result: any) => {
            if (result.ok) {
                bizResp.code = BizCode.SUCCESS;
                bizResp.data = result.id;
            } else {
                bizResp.code = BizCode.FAIL;
                bizResp.msg = "插入失败";
            }
            resp.json(bizResp);
            resp.end();
        }).catch((err: any) => {
            bizResp.code = BizCode.ERROR;
            bizResp.msg = err;
            resp.json(bizResp);
            resp.end();
        });
    } else {
        localDB.get(rule._id).then((doc: any) => {
            let newRule = Object.assign(rule, { _rev: doc._rev });
            return localDB.put(newRule);
        }).then((result: any) => {
            if (result.ok) {
                bizResp.code = BizCode.SUCCESS;
                bizResp.data = result.id;
            } else {
                bizResp.code = BizCode.FAIL;
                bizResp.msg = "插入失败";
            }
            resp.json(bizResp);
            resp.end();
        }).catch((err: any) => {
            bizResp.code = BizCode.ERROR;
            bizResp.msg = err;
            resp.json(bizResp);
            resp.end();
        });
    }
}

// delete mock rule
export function deleteMockRule(req: Request, resp: Response) {
    let ruleId: string = req.body['ruleId'];
    let bizResp: BizResponse<string> = new BizResponse<string>();
    localDB.get(ruleId).then((doc: any) => {
        return localDB.remove(doc);
    }).then((result: any) => {
        if (result.ok) {
            bizResp.code = BizCode.SUCCESS;
            bizResp.data = "成功删除记录";
        } else {
            bizResp.code = BizCode.FAIL;
            bizResp.msg = "Mock规则删除失败";
        }

        resp.json(bizResp);
        resp.end;
    }).catch((err: any) => {
        bizResp.code = BizCode.ERROR;
        bizResp.msg = err;
        resp.json(bizResp);
        resp.end;
    });
}

export function updateMockRecord(record: ProxyRequestRecord) {

}

export function deleteMockRecord(recordId: ProxyRequestRecord) {

}