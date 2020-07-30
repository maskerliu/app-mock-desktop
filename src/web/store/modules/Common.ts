import { Message } from "element-ui"
import PouchDB from "pouchdb"
import { ActionTree, Commit, GetterTree, MutationTree } from "vuex"
import store from "../"
import { updateLocalDomain, updateClientUID } from "../../../model/BasicLocalAPI"
import { getLocalServerConfig } from "../../../model/LocaAPIs"
import { CommonState } from "../types"
import { PushClient } from "../../../common/PushClient"
import { generateUid } from "../../../common/Utils"

const state: CommonState = {
    showQrCodeDialog: false,
    registerUrl: "",
    localServerConfig: {
        serverIP: null,
        proxyHttpPort: null,
        proxySocketPort: null,
        pushSocketPort: null,
        ips: [],
        pbFiles: [],
    }
};

const db = new PouchDB('SharePerferences');
let pushClient: PushClient = null;

export const getters: GetterTree<CommonState, any> = {};

// async
export const actions: ActionTree<CommonState, any> = {
    init(context: { commit: Commit }): void {
        pushClient = new PushClient(store);
        getLocalServerConfig().then(resp => {
            store.commit("updateLocalServerConfig", resp.data.data);
        }).catch(err => { });
    },
    unInit(context: { commit: Commit }): void {

    },
    saveLocalServerConfig(context: { commit: Commit }, params: any) {

    },
};

// sync
export const mutations: MutationTree<CommonState> = {
    updateShowQrCodeDialog(state, display) {
        state.showQrCodeDialog = display;
    },
    updateLocalServerConfig(state, params) {
        let uid = generateUid();
        state.localServerConfig = params;
        state.registerUrl = `http://${params.serverIP}:${params.proxyHttpPort}/mw/register?_=0__0&uid=${uid}`;
        updateLocalDomain(state.localServerConfig);
        updateClientUID(uid);
        pushClient.start(params.serverIP, params.pushSocketPort, uid);
    }
};

export default {
    namespaced: false,
    state,
    getters,
    actions,
    mutations,
};
