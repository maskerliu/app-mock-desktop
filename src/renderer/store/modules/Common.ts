import { ipcRenderer } from "electron";
import { Message } from "element-ui";
import PouchDB from "pouchdb";
import { ActionTree, Commit, GetterTree, MutationTree } from "vuex";
import store from "../";
import { updateLocalDomain } from "../../../model/BasicLocalAPI";
import PushClient from "../../common/PushClient";
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
    pushSocketPort: null,
    ips: [],
    pbFiles: [],
  },
  mockRuleSyncServer: "",
  statRuleSyncServer: "",
  dataProxyServer: "",
  dataProxyStatus: false
};

let db = new PouchDB('SharePerferences', { adapter: 'leveldb' });

function generateUid() {
  let len = 8;
  let res = [];
  for (let i = 0; i !== len; ++i) {
    res.push(
      String.fromCharCode(
        Math.floor(Math.random() * 26) + (Math.random() > 0.5 ? 65 : 97)
      )
    );
  }
  res.push(new Date().getTime() + "o");
  return res.join("");
}

export const getters: GetterTree<CommonState, any> = {};

// async
export const actions: ActionTree<CommonState, any> = {
  init(context: { commit: Commit }): void {
    ipcRenderer.on("get-local-server-config", (event: any, data: any) => {
      store.commit("updateLocalServerConfig", data);
    });
    ipcRenderer.on("on-selected-files", (event: any, data: any) => {
      console.log("on select files");
      // data.files.forEach((item: string) => {
      //     var strs = item.split("/");
      //     this.pbFiles.push({ name: strs[strs.length - 1], value: item });
      // });
    });
    ipcRenderer.send("get-local-server-config");

    db.get('statRuleSyncServer').then((result: any) => {
      state.statRuleSyncServer = result.url;
    }).catch(err => { });

    db.get('mockRuleSyncServer').then((result: any) => {
      state.mockRuleSyncServer = result.url;
    }).catch(err => { });

    db.get('dataProxyServer').then((result: any) => {
      state.dataProxyServer = result.url;
      state.dataProxyStatus = result.status;
      ipcRenderer.send("update-data-proxy-server", { url: state.dataProxyServer, status: state.dataProxyStatus });
    }).catch(err => { });
  },
  updateNavBarConfig(context: { commit: Commit }, params: any): void {
    context.commit("updateNavBarConfig", params);
  },
  unInit(context: { commit: Commit }): void {
    ipcRenderer.removeAllListeners("get-local-server-config");
  },
  saveLocalServerConfig(context: { commit: Commit }, params: any) {
    ipcRenderer.send("update-local-server-config", params);
  },
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
    state.localServerConfig.serverIP = params.serverIP;
    state.localServerConfig.proxyHttpPort = params.proxyHttpPort;
    state.localServerConfig.proxySocketPort = params.proxySocketPort;
    state.localServerConfig.pushSocketPort = params.pushSocketPort;
    state.localServerConfig.ips = params.ips;
    state.localServerConfig.pbFiles = params.pbFiles;
    state.registerUrl = `http://${params.serverIP}:${params.proxyHttpPort}/mw/register?_=0__0&uid=${generateUid()}`;

    updateLocalDomain(state.localServerConfig);

    PushClient.start(params.serverIP, params.pushSocketPort);
  },
  updateMockRuleSyncServer(state, url) {
    db.put(
      {
        _id: 'mockRuleSyncServer',
        url: this.statRuleSyncServer,
      }
    ).then((res) => {
      state.mockRuleSyncServer = url;
      Message.success("成功更新Mock数据服务地址");
    }).catch(err => {
      Message.warning("更新Mock数据服务地址失败");
    });
  },
  updateStatRuleSyncServer(state, url) {
    db.get("statRuleSyncServer").then(doc => {
      db.put(
        {
          _id: 'statRuleSyncServer',
          _rev: doc._rev,
          url: url,
        }
      ).then((res) => {
        state.statRuleSyncServer = url;
        Message.success("成功更新埋点数据服务地址");
      }).catch(err => { Message.warning("更新埋点数据服务地址失败"); });
    }).catch(err => {
      db.post({
        _id: 'statRuleSyncServer',
        url: url,
      }).then(res => {
        state.statRuleSyncServer = url;
        Message.success("成功更新埋点数据服务地址");
      }).catch(err => { Message.warning("更新埋点数据服务地址失败"); })
    })

  },
  updateDataProxyServer(state, params: { url: string, status: boolean }) {
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
        Message.success("成功更新Mock数据服务地址");
      }).catch(err => {
        Message.warning("更新Mock数据服务地址失败");
      });
    }).catch(err => {
      db.post({
        _id: 'dataProxyServer',
        url: params.url,
        status: params.status
      }).then(res => {
        state.dataProxyServer = params.url;
        state.dataProxyStatus = params.status;
        Message.success("成功更新埋点数据服务地址");
      }).catch(err => { Message.warning("更新埋点数据服务地址失败"); })
    });
  }
};

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations,
};
