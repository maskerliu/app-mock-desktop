import { app } from "electron"
import { Request, Response } from "express"
import path from "path"
import PouchDB from "pouchdb"
import PouchDBFind from "pouchdb-find"
import { CMDCode, BizCode, BizResponse, MockRule, ProxyRequestRecord } from "../model/DataModels"
import PushService from "./PushService"

const JSONBigInt = require("json-bigint");

class MockService {
  private localDB: any;
  private isMock: boolean;
  private curMockRule: MockRule;

  constructor() {
    this.isMock = false;
    this.curMockRule = null;

    this.initDB();
  }

  private initDB() {
    PouchDB.plugin(PouchDBFind);
    this.localDB = new PouchDB(path.join(app.getPath("userData"), "AppMockDB"));
    this.localDB.createIndex({
      index: { fields: ["_id"] },
    }).then((result: any) => {
      // console.log(result);
    }).catch((err: any) => {
      console.error("initDB", err);
    });
    this.updateMockSettings();
  }

  public mockRequestData(sessionId: number, req: Request, resp: Response, startTime: number, proxyDelay: number): boolean {
    if (
      !this.isMock ||
      this.curMockRule == null ||
      this.curMockRule.requests == null
    )
      return false;

    for (let i: number = 0; i < this.curMockRule.requests.length; ++i) {
      if (this.curMockRule.requests[i].url === req.url) {
        let record = this.curMockRule.requests[i];
        try {
          setTimeout(() => {
            let statusCode: number = record.statusCode || 200;
            resp.status(statusCode);
            resp.json(record.responseData);
            resp.end();

            let data: ProxyRequestRecord = {
              id: sessionId,
              type: CMDCode.REQUEST_END,
              statusCode: statusCode,
              headers: !!record.responseHeaders ? record.responseHeaders : null,
              responseData: !!record.responseData ? JSON.stringify(record.responseData) : null,
              time: new Date().getTime() - startTime,
              isMock: true,
            };
            PushService.sendMessage(data);
          }, proxyDelay);
          return true;
        } catch (err) {
          console.error("mockRequestData", err);
          console.error(record);
          return false;
        }
      }
    }
    return false;
  }

  public searchMockRules(req: Request, resp: Response): void {
    let keyword: any = req.query["keyword"];
    let selector = { _id: { $ne: /_design\/idx/ } };
    if (keyword == null) {
      selector = Object.assign(selector, { name: { $ne: keyword } });
    } else {
      selector = Object.assign(selector, {
        name: { $regex: new RegExp(`${keyword}`) },
      });
    }

    let bizResp: BizResponse<Array<MockRule>> = new BizResponse<Array<MockRule>>();
    this.localDB.find({
      selector: selector,
      limit: 15,
      fields: ["_id", "name", "desc", "isMock"],
      sort: ["name"],
    }).then((result: any) => {
      let rules: Array<MockRule> = [];
      for (let i: number = 0; i < result.docs.length; ++i) {
        try {
          let rule: MockRule = result.docs[i];
          rules.push(rule);
        } catch (err) {
          console.error("searchMockRules", err);
        }
      }
      bizResp.code = BizCode.SUCCESS;
      bizResp.data = rules;
      resp.json(bizResp);
      resp.end();
    }).catch((err: any) => {
      console.error("searchMockRules", err);
      bizResp.code = BizCode.ERROR;
      bizResp.msg = err;
      resp.json(bizResp);
      resp.end();
    });
  }

  public getMockRuleDetail(req: Request, resp: Response): void {
    let ruleId: any = req.query["ruleId"];
    let bizResp: BizResponse<Array<MockRule>> = new BizResponse<Array<MockRule>>();
    this.localDB.get(ruleId, { attachments: true }).then((result: any) => {
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

  public saveMockRule(req: Request, resp: Response): void {
    let onlySnap: boolean = req.query["onlySnap"] == "true";
    let rule: MockRule = JSONBigInt.parse(req.body);
    // let rule: MockRule = req.body;

    if (rule.isMock) {
      this.localDB.find({
        selector: {
          isMock: true,
          _id: { $ne: rule._id },
        },
      }).then((result: any) => {
        if (result.docs.length > 0) {
          result.docs[0].isMock = false;
          return this.localDB.put(result.docs[0]);
        }
      }).catch((err: any) => {
        console.error("saveMockRule", err);
      });
    }

    if (rule._id === null || rule._id === undefined) {
      this.insertMockRule(resp, rule);
    } else {
      this.updateMockRule(resp, rule, onlySnap);
    }
  }

  private insertMockRule(resp: Response, rule: MockRule): void {
    let bizResp: BizResponse<string> = new BizResponse<string>();
    this.localDB.post(rule).then((result: any) => {
      if (result.ok) {
        this.updateMockSettings();
        bizResp.code = BizCode.SUCCESS;
        bizResp.data = result.id;
      } else {
        bizResp.code = BizCode.FAIL;
        bizResp.msg = "插入失败";
      }
      resp.json(bizResp);
      resp.end();
      return null;
    }).catch((err: any) => {
      bizResp.code = BizCode.ERROR;
      bizResp.msg = err;
      resp.json(bizResp);
      resp.end();
    });
  }

  private updateMockRule(resp: Response, rule: MockRule, onlySnap: boolean): void {
    let bizResp: BizResponse<string> = new BizResponse<string>();
    this.localDB.get(rule._id).then((doc: any) => {
      let newRule = Object.assign(rule, { _rev: doc._rev });
      if (onlySnap) newRule.requests = doc.requests;
      return this.localDB.put(newRule);
    }).then((result: any) => {
      if (result.ok) {
        this.updateMockSettings();
        bizResp.code = BizCode.SUCCESS;
        bizResp.data = result.id;
      } else {
        bizResp.code = BizCode.FAIL;
        bizResp.msg = "插入失败";
      }
      resp.json(bizResp);
      resp.end();
      return null;
    }).catch((err: any) => {
      bizResp.code = BizCode.ERROR;
      bizResp.msg = err;
      resp.json(bizResp);
      resp.end();
    });
  }

  public deleteMockRule(req: Request, resp: Response): void {
    let ruleId: any = req.query["ruleId"];
    let bizResp: BizResponse<string> = new BizResponse<string>();
    this.localDB.get(ruleId).then((doc: any) => {
      return this.localDB.remove(doc);
    }).then((result: any) => {
      this.updateMockSettings();
      if (result.ok) {
        bizResp.code = BizCode.SUCCESS;
        bizResp.data = "成功删除记录";
      } else {
        bizResp.code = BizCode.FAIL;
        bizResp.msg = "Mock规则删除失败";
      }
      resp.json(bizResp);
      resp.end;
      return null;
    }).catch((err: any) => {
      bizResp.code = BizCode.ERROR;
      bizResp.msg = err;
      resp.json(bizResp);
      resp.end;
    });
  }

  public uploadMockRule(req: Request, resp: Response): void {
    let ruleId: any = req.query["ruleId"];
    let bizResp: BizResponse<string> = new BizResponse<string>();
    this.localDB.get(ruleId, { attachments: true }).then((result: any) => {
      bizResp.code = BizCode.SUCCESS;
      bizResp.data = "上传成功";
      resp.json(bizResp);
      resp.end();
    }).catch((err: any) => {
      bizResp.code = BizCode.ERROR;
      bizResp.msg = err;
      resp.json(bizResp);
      resp.end();
    });
  }

  private updateMockSettings(): void {
    this.localDB.find({ selector: { isMock: true } }).then((result: any) => {
      if (result.docs != null) {
        this.isMock = true;
        this.curMockRule = result.docs[0];
      }
    }).catch((err: any) => { });
  }
}

export default new MockService();
