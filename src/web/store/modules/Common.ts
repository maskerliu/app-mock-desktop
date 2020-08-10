import { ActionTree, Commit, GetterTree, MutationTree } from "vuex"
import store from "../"
import { PushClient } from "../../../common/PushClient"
import { generateUid } from "../../../common/Utils"
import { updateClientUID, updateLocalDomain } from "../../../model/BasicLocalAPI"
import { PushMsg } from "../../../model/DataModels"
import { getLocalServerConfig } from "../../../model/LocaAPIs"
import { CommonState } from "../types"

const state: CommonState = {
    showQrCodeDialog: false,
    registerUrl: "",
    localServerConfig: {
        serverIP: null,
        proxyHttpPort: null,
        proxySocketPort: null,
        ips: [],
        pbFiles: [],
    }
};

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
        pushClient.close();
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
    updateLocalServerConfig(state, params) {
        let uid = generateUid();
        state.localServerConfig = params;
        state.registerUrl = `http://${params.serverIP}:${params.proxyHttpPort}/mw/register?_=0__0&uid=${uid}`;
        updateLocalDomain(state.localServerConfig);
        updateClientUID(uid);
        pushClient.start(`http://${params.serverIP}:${params.proxyHttpPort}`, uid);
    }
};

export default {
    namespaced: false,
    state,
    getters,
    actions,
    mutations,
};
