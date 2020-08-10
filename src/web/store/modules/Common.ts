import { ActionTree, Commit, GetterTree, MutationTree } from "vuex"
import store from "../"
import { PushClient } from "../../../common/PushClient"
import { generateUid } from "../../../common/Utils"
import { updateClientUID } from "../../../model/BasicLocalAPI"
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
    },
    statRuleServer: ""
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
        updateClientUID(uid);
        state.registerUrl = `${process.env.SERVER_BASE_URL}/mw/register?_=0__0&uid=${uid}`;
        pushClient.start(`${process.env.SERVER_BASE_URL}`, uid);
    }
};

export default {
    namespaced: false,
    state,
    getters,
    actions,
    mutations,
};
