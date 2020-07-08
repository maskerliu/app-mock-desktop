import { Request, Response } from "express";
import { CMDCode } from "../model/DataModels";
import MockService from "./MockService";
import PushService from "./PushService";
import { request } from "http";

const DEFAULT_HEADER = { "Content-Type": "text/html" };

class WebService {
  constructor() {}

  filter(req: Request, resp: Response) {
    let props = this.parseUrl(req.url);

    try {
      if (MockService[props.path] != null) {
        MockService[props.path].apply(MockService, [req, resp]);
      } else if (this[props.path] != null) {
        this[props.path].apply(this, [req, resp]);
      }
    } catch (err) {
      console.log("filter error", req.params);
      console.log("filter error", err);
      this.error(req, resp, err);
    }
  }

  public register(req: Request, resp: Response): void {
    resp.writeHead(200, DEFAULT_HEADER);
    let uid = req.query["uid"];
    if (uid) {
      resp.end();
      let data = {
        type: CMDCode.REGISTER_SUCCESS,
        data: uid,
      };
      PushService.sendMessage(data);
    } else {
      resp.end("invalid uid");
    }
  }

  private error(req: Request, resp: Response, err: any) {
    // resp.writeHead(400, DEFAULT_HEADER);
    resp.send(err.message);
    resp.end();
  }

  private parseUrl(url: string): { path: string; type: string } {
    let length = /^\/mw\//.test(url) ? 4 : 0;
    length = /^\/appmock\//.test(url) ? 9 : length;
    let path = url.substring(length).split("?")[0]; // remove /mw/
    return { path: path, type: "cgi" };
  }
}

export default new WebService();
