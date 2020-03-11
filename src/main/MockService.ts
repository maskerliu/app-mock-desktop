
import { Request, Response } from 'express'
import * as PushService from "./PushService"
import PouchDB from "pouchdb"
import { MockRule, ProxyRequestRecord } from '../model/DataModels';

let PROXY_DELAY = 0;

let localDB = null;

export function mockRequestData(req: Request, resp: Response, rule: any, sessionId: number, startTime: number) {
    setTimeout(() => {
        let statusCode: number = rule.statusCode || 200;
        resp.status(statusCode);
        resp.json(rule.responseData);
        resp.end();
        PushService.sendRequestEndMessage(sessionId, startTime, statusCode, rule.responseHeader, rule.responseData, true);
    }, PROXY_DELAY);
}

export function initDB() {
    localDB = new PouchDB('AppMockDB');

    localDB.info().then(function (info) {
        console.log(info);
    });
}

export function getPagedMockRules(): Array<MockRule> {

    return null;
}

export function getMockRuleDetail(): MockRule {

    return null;
}

// add or update mock rule
export function saveMockRule(rule: MockRule) {
    if (rule._id === null) {

    } else {
    }
}

// delete mock rule
export function deleteMockRule(ruleId: string) {

}

export function updateMockRecord(record: ProxyRequestRecord) {

}

export function deleteMockRecord(recordId: ProxyRequestRecord) {

}