import { Request, Response } from 'express'

import { sendMessage } from "./PushService"
import { CMDCode } from '../model/DataModels'
import { getPagedMockRules, saveMockRule, deleteMockRule, getMockRuleDetail, searchMockRules } from './MockService'

const DEFAULT_HEADER = { 'Content-Type': 'text/html' };

export function filter(req: Request, resp: Response) {
    let props = parseUrl(req.url);
    if (props == null) {
        error(req, resp);
    } else {
        switch (props.path) {
            case "register":
                register(req, resp);
                break;
            case "getPagedMockRules":
                getPagedMockRules(req, resp);
                break;
            case "searchMockRules":
                searchMockRules(req, resp);
                break;
            case "getMockRuleDetail":
                getMockRuleDetail(req, resp);
                break;
            case "saveMockRule":
                saveMockRule(req, resp);
                break;
            case "deleteMockRule":
                deleteMockRule(req, resp);
                break;
            default:
                error(req, resp);
                break;
        }
    }

}

function parseUrl(url: string) {
    if (/^\/appmock\//.test(url)) {
        let path = url.substring(9).split('?')[0];	// remove /mw/
        return {
            path: path,
            type: 'cgi'
        };
    }
    return null;
}

function register(req: Request, resp: Response) {
    resp.writeHead(200, DEFAULT_HEADER);
    let uid = req.query['uid'];
    if (uid) {
        resp.end();

        let data = {
            code: CMDCode.REGISTER_SUCCESS,
            data: uid
        };
        sendMessage(data);
    } else {
        resp.end('invalid uid');
    }
}

function error(req: Request, resp: Response) {
    resp.writeHead(-100, DEFAULT_HEADER);
    resp.send('unknow error');
    resp.end();
}