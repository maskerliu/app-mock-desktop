import { ipcRenderer } from "electron";
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
};

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
    state.registerUrl = `http://${params.serverIP}:${
      params.proxyHttpPort
    }/mw/register?_=0__0&uid=${generateUid()}`;

    updateLocalDomain(state.localServerConfig);

    PushClient.start(params.serverIP, params.pushSocketPort);
  },
};

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations,
};
