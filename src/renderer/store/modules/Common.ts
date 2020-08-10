import { ipcRenderer, remote } from "electron";
import Message from "element-ui/packages/message";
import path from "path";
import PouchDB from "pouchdb";
import { ActionTree, Commit, GetterTree, MutationTree } from "vuex";
import store from "../";
import { PushClient } from "../../../common/PushClient";
import { generateUid, isUrl } from "../../../common/Utils";
import { updateClientUID } from "../../../model/BasicLocalAPI";
import { PushMsg } from "../../../model/DataModels";
import { CommonState } from "../types";

const state: CommonState = {
  showQrCodeDialog: false,
  navBarConfig: {
    leftItem: false,
    leftCallback: null,
    rightItem: false,
    rightCallback: null,
    title: "",
  },
  registerUrl: "",
  localServerConfig: {
    serverIP: null,
    proxyHttpPort: null,
    proxySocketPort: null,
    ips: [],
    pbFiles: [],
  },
  apiDefineServer: "",
  mockRuleServer: "",
  statRuleServer: "",
  dataProxyServer: "",
  dataProxyStatus: false,
  versionCheckServer: ""
};

const db = new PouchDB(path.join(remote.app.getPath("userData"), 'SharePerferences'), { adapter: 'leveldb' });
let pushClient: PushClient = null;

export const getters: GetterTree<CommonState, any> = {};

// async
export const actions: ActionTree<CommonState, any> = {
  init(context: { commit: Commit }): void {
    pushClient = new PushClient(store);

    ipcRenderer.on("get-local-server-config", (event: any, data: any) => {
      store.commit("updateLocalServerConfig", data);
    });

    ipcRenderer.send("get-local-server-config");

    ipcRenderer.on("on-selected-files", (event: any, data: any) => {
      // data.files.forEach((item: string) => {
      //     var strs = item.split("/");
      //     this.pbFiles.push({ name: strs[strs.length - 1], value: item });
      // });
    });

    db.get('apiDefineServer').then((result: any) => {
      state.apiDefineServer = result.url;
    }).catch(err => { });

    db.get('statRuleServer').then((result: any) => {
      state.statRuleServer = result.url;
    }).catch(err => { });

    db.get('mockRuleServer').then((result: any) => {
      state.mockRuleServer = result.url;
    }).catch(err => { });

    db.get('dataProxyServer').then((result: any) => {
      state.dataProxyServer = result.url;
      state.dataProxyStatus = result.status;
      ipcRenderer.send("update-data-proxy-server", { url: state.dataProxyServer, status: state.dataProxyStatus });
    }).catch(err => { });

    db.get('versionCheckServer').then((result: any) => {
      state.versionCheckServer = result.url;
      ipcRenderer.send("update-version-check-server", { url: state.versionCheckServer });
    }).catch(err => { });
  },
  unInit(context: { commit: Commit }): void {
    ipcRenderer.removeAllListeners("get-local-server-config");
    ipcRenderer.removeAllListeners("on-selected-files");
  },
  saveLocalServerConfig(context: { commit: Commit }, params: any) {
    ipcRenderer.send("update-local-server-config", params);
  },
  sendMessage(context: { commit: Commit }, params: PushMsg<any>) {
    pushClient.send(params);
  }
};

// sync
export const mutations: MutationTree<CommonState> = {
  updateShowQrCodeDialog(state, display) {
    state.showQrCodeDialog = display;
  },
  updateNavBarConfig(state, navBarConfig) {
    state.navBarConfig = Object.assign({}, navBarConfig);
  },
  updateLocalServerConfig(state, params) {
    let uid = generateUid();
    state.localServerConfig.serverIP = params.serverIP;
    state.localServerConfig.proxyHttpPort = params.proxyHttpPort;
    state.localServerConfig.proxySocketPort = params.proxySocketPort;
    state.localServerConfig.ips = params.ips;
    state.localServerConfig.pbFiles = params.pbFiles;
    updateClientUID(uid);
    state.registerUrl = `${process.env.SERVER_BASE_URL}/mw/register?_=0__0&uid=${uid}`;
    pushClient.start(`${process.env.SERVER_BASE_URL}`, uid);
  },
  updateApiDefineServer(state, url) {
    if (!isUrl(url)) {
      Message.error({ message: "非法Api定义服务地址", duration: 1000 });
      return;
    }

    db.get("apiDefineServer").then(doc => {
      db.put(
        {
          _id: 'apiDefineServer',
          _rev: doc._rev,
          url: url,
        }
      ).then((res) => {
        state.apiDefineServer = url;
        Message.success({ message: "成功更新Api定义服务地址", duration: 500 });
      }).catch(err => { Message.warning("更新Api定义服务地址失败"); });
    }).catch(err => {
      db.post({
        _id: 'apiDefineServer',
        url: url,
      }).then(res => {
        state.apiDefineServer = url;
        Message.success({ message: "成功更新Api定义服务地址", duration: 500 });
      }).catch(err => { Message.warning("更新Api定义服务地址失败"); })
    });
  },
  updateStatRuleServer(state, url) {
    if (!isUrl(url)) {
      Message.error({ message: "非法埋点数据服务地址", duration: 1000 });
      return;
    }
    db.get("statRuleServer").then(doc => {
      db.put(
        {
          _id: 'statRuleServer',
          _rev: doc._rev,
          url: url,
        }
      ).then((res) => {
        state.statRuleServer = url;
        Message.success({ message: "成功更新埋点数据服务地址", duration: 500 });
      }).catch(err => { Message.warning("更新埋点数据服务地址失败"); });
    }).catch(err => {
      db.post({
        _id: 'statRuleServer',
        url: url,
      }).then(res => {
        state.statRuleServer = url;
        Message.success({ message: "成功更新埋点数据服务地址", duration: 500 });
      }).catch(err => { Message.warning("更新埋点数据服务地址失败"); })
    });
  },
  updateMockRuleServer(state, url) {
    if (!isUrl(url)) {
      Message.error({ message: "非法Mock数据服务地址", duration: 1000 });
      return;
    }
    db.get("mockRuleServer").then(doc => {
      db.put(
        {
          _id: 'mockRuleServer',
          _rev: doc._rev,
          url: url,
        }
      ).then((res) => {
        state.mockRuleServer = url;
        Message.success({ message: "成功更新Mock数据服务地址", duration: 500 });
      }).catch(err => { Message.warning("更新Mock数据服务地址失败"); });
    }).catch(err => {
      db.post({
        _id: 'mockRuleServer',
        url: url,
      }).then(res => {
        state.mockRuleServer = url;
        Message.success({ message: "成功更新Mock数据服务地址", duration: 500 });
      }).catch(err => { Message.warning("更新Mock数据服务地址失败"); })
    });
  },
  updateDataProxyServer(state, params: { url: string, status: boolean }) {
    if (!isUrl(params.url)) {
      Message.error({ message: "非法数据代理服务地址", duration: 1000 });
      return;
    }
    db.get("dataProxyServer").then(doc => {
      db.put(
        {
          _id: 'dataProxyServer',
          _rev: doc._rev,
          url: params.url,
          status: params.status
        }
      ).then((res) => {
        state.dataProxyServer = params.url;
        state.dataProxyStatus = params.status;
        ipcRenderer.send("update-data-proxy-server", params);
        Message.success({ message: "成功更新数据代理服务地址", duration: 500 });
      }).catch(err => {
        Message.warning("更新数据代理服务地址失败");
      });
    }).catch(err => {
      db.post({
        _id: 'dataProxyServer',
        url: params.url,
        status: params.status
      }).then(res => {
        state.dataProxyServer = params.url;
        state.dataProxyStatus = params.status;
        Message.success({ message: "成功更新数据代理服务地址", duration: 500 });
      }).catch(err => { Message.warning("更新数据代理服务地址失败"); })
    });
  },
  updateVersionCheckServer(state, url) {
    if (!isUrl(url)) {
      Message.error({ message: "非法版本检查服务地址", duration: 1000 });
      return;
    }
    db.get("versionCheckServer").then(doc => {
      db.put(
        {
          _id: 'versionCheckServer',
          _rev: doc._rev,
          url: url,
        }
      ).then((res) => {
        state.versionCheckServer = url;
        ipcRenderer.send("update-version-check-server", { url: state.versionCheckServer });
        Message.success({ message: "成功更新版本检查服务地址", duration: 500 });
      }).catch(err => {
        Message.warning("更新版本检查服务地址失败" + err);
      });
    }).catch(err => {
      db.post({
        _id: 'versionCheckServer',
        url: url,
      }).then(res => {
        state.versionCheckServer = url;
        ipcRenderer.send("update-version-check-server", { url: state.versionCheckServer });
        Message.success({ message: "成功更新版本检查服务地址", duration: 500 });
      }).catch(err => { Message.warning("更新版本检查服务地址失败" + err); })
    });
  },
};

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations,
};
