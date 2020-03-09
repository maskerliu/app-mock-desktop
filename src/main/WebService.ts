import { Request, Response } from 'express'

import { sendMessage } from "./PushService"
import { CMDCode } from '../model/DataModels';

const DEFAULT_HEADER = { 'Content-Type': 'text/html' };
const VALID_PATHS = ['register',];

export function filter(req: Request, resp: Response) {
    let url = req.url;
    if (url === '/') {
        // Web.index(req, resp);
        return;
    }

    let props = parseUrl(url);
    if (props) {
        console.log(props);
        console.log(this);

        if (props.type !== "cgi") return;

        switch (props.path) {
            case "register":
                register(req, resp);
                break;
            default:
                error(req, resp);
                break;
        }
    }
}

function parseUrl(url: string) {
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