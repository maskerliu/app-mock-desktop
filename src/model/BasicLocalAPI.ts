import axios, { AxiosPromise } from "axios";
import { Message } from "element-ui";

import { BizResponse, BizCode } from "./DataModels";

axios.defaults.adapter = require("axios/lib/adapters/http");
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true;
axios.interceptors.response.use(
  (resp) => {
    return resp;
  },
  (err) => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = "请求错误(400)";
          break;
        case 401:
          err.message = "未授权，请重新登录(401)";
          break;
        case 403:
          err.message = "拒绝访问(403)";
          break;
        case 404:
          err.message = "请求出错(404)";
          break;
        case 408:
          err.message = "请求超时(408)";
          break;
        case 500:
          err.message = "服务器错误(500)";
          break;
        case 501:
          err.message = "服务未实现(501)";
          break;
        case 502:
          err.message = "网络错误(502)";
          break;
        case 503:
          err.message = "服务不可用(503)";
          break;
        case 504:
          err.message = "网络超时(504)";
          break;
        case 505:
          err.message = "HTTP版本不受支持(505)";
          break;
        default:
          err.message = `连接出错(${err.response.status})!`;
      }
    } else {
      err.message = "连接服务器失败!";
    }
    return Promise.reject(err);
  }
);

export let BASE_LOCAL_URL = null;
export let BASE_UPLOAD_URL = null;
let clientUID = null;

export function get(
  path: string,
  baseUrl?: string,
  params?: {}
): AxiosPromise<BizResponse<any>> {
  return axios({
    baseURL: BASE_LOCAL_URL == null ? baseUrl : BASE_LOCAL_URL,
    url: path,
    method: "GET",
    params: Object.assign({ uid: clientUID }, params),
  }).then((resp) => {
    switch (resp.data.code) {
      case BizCode.SUCCESS:
        return resp;
      case BizCode.FAIL:
        Message({ message: resp.data.msg, type: "warning" });
        return Promise.reject(resp);
      case BizCode.ERROR:
        Message({ message: resp.data.msg, type: "error" });
        return Promise.reject(resp);
      default:
        return Promise.reject(resp);
    }
  });
}

export function post(
  path: string,
  baseUrl?: string,
  params?: {},
  data?: {}
): AxiosPromise<BizResponse<any>> {
  return axios({
    baseURL: BASE_LOCAL_URL == null ? baseUrl : BASE_LOCAL_URL,
    url: path,
    method: "POST",
    params: Object.assign({ uid: clientUID }, params),
    data: data,
  }).then((resp) => {
    switch (resp.data.code) {
      case BizCode.SUCCESS:
        return resp;
      case BizCode.FAIL:
        Message({ message: resp.data.msg, type: "warning" });
        return Promise.reject(resp);
      case BizCode.ERROR:
        Message({ message: resp.data.msg, type: "error" });
        return Promise.reject(resp);
      default:
        return Promise.reject(resp);
    }
  });
}

export function updateLocalDomain(localServerConfig: any) {
  BASE_LOCAL_URL = `http://${localServerConfig.serverIP}:${localServerConfig.proxyHttpPort}`;
  BASE_UPLOAD_URL = `http://${localServerConfig.syncServerUrl}`;
}

export function updateClientUID(uid: string) {
  clientUID = uid;
}