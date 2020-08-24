import { ipcRenderer, remote } from "electron";
import Message from "element-ui/packages/message";
import path from "path";
import PouchDB from "pouchdb";
import { ActionTree, Commit, GetterTree, MutationTree } from "vuex";
import store from "../";
import { PushClient } from "../../../common/PushClient";
import { generateUid } from "../../../common/Utils";
import { updateClientUID, updateBaseDomain } from "../../../model/BasicLocalAPI";
import { LocalServerConfig, PushMsg, ClientInfo } from "../../../model/DataModels";
import { syncLocalServerConfig } from "../../../model/LocaAPIs";
import { CommonState, NavBarConfig } from "../types";

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
  localServerConfig: {},
  clientInfos: []
};

const db = new PouchDB(path.join(remote.app.getPath("userData"), 'SharePerferences'), { adapter: 'leveldb' });
let pushClient: PushClient = null;

export const getters: GetterTree<CommonState, any> = {};

// async
export const actions: ActionTree<CommonState, any> = {
  init(context: { commit: Commit }): void {
    pushClient = new PushClient(store);

    if (process.env.NODE_ENV != 'production' && process.env.SERVER_BASE_URL) {
      updateBaseDomain(process.env.SERVER_BASE_URL);
    }

    db.get('localServerConfig').then((result: any) => {
      syncLocalServerConfig(result.config).then(resp => {
        state.localServerConfig = resp.data.data;
      }).catch(err => { });
    }).catch(err => { });

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
  },
  unInit(context: { commit: Commit }): void {
    ipcRenderer.removeAllListeners("get-local-server-config");
    ipcRenderer.removeAllListeners("on-selected-files");
  },
  saveLocalServerConfig(context: { commit: Commit }, config: LocalServerConfig) {
    let newConfig: LocalServerConfig = Object.assign(state.localServerConfig, config);
    delete newConfig.serverIP;
    delete newConfig.proxyHttpPort;
    delete newConfig.proxySocketPort;
    delete newConfig.ips;
    db.get("localServerConfig").then(doc => {
      db.put(
        {
          _id: 'localServerConfig',
          _rev: doc._rev,
          config: newConfig,
        }
      ).then((res) => {
        state.localServerConfig = newConfig;
        Message.success({ message: "应用配置更新成功", duration: 500 });
      }).catch(err => { Message.warning("应用配置更新失败"); });
    }).catch(err => {
      db.post({
        _id: 'localServerConfig',
        config: newConfig,
      }).then(res => {
        state.localServerConfig = newConfig;
        Message.success({ message: "应用配置更新成功", duration: 500 });
      }).catch(err => { Message.warning("应用配置更新失败"); })
    });
    syncLocalServerConfig(newConfig).then(resp => {
      state.localServerConfig = resp.data.data;
    }).catch(err => { });
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
  updateNavBarConfig(state, navBarConfig: NavBarConfig) {
    state.navBarConfig = Object.assign({}, navBarConfig);
  },
  updateLocalServerConfig(state, config: LocalServerConfig) {
    let uid = generateUid();
    state.localServerConfig = Object.assign(state.localServerConfig, config);
    updateClientUID(uid);

    if (process.env.NODE_ENV == 'production' && process.env.SERVER_BASE_URL) {
      updateBaseDomain(process.env.SERVER_BASE_URL);
      state.registerUrl = `${process.env.SERVER_BASE_URL}/mw/register?_=0__0&uid=${uid}`;
      pushClient.start(process.env.SERVER_BASE_URL, uid);
    } else {
      updateBaseDomain(`http://${state.localServerConfig.serverIP}:${state.localServerConfig.proxyHttpPort}`);
      state.registerUrl = `http://${state.localServerConfig.serverIP}:${state.localServerConfig.proxyHttpPort}/mw/register?_=0__0&uid=${uid}`;
      pushClient.start(`http://${state.localServerConfig.serverIP}:${state.localServerConfig.proxyHttpPort}`, uid);
    }
  },
  updateClientInfos(state, clientInfos: Array<ClientInfo>) {
    state.clientInfos = Object.assign([], clientInfos);
  }
};

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations,
};
