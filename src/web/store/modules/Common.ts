import { ActionTree, Commit, GetterTree, MutationTree } from "vuex"
import store from "../"
import { PushClient } from "../../../common/PushClient"
import { generateUid } from "../../../common/Utils"
import { updateClientUID, updateBaseDomain } from "../../../model/BasicLocalAPI"
import { PushMsg, ClientInfo } from "../../../model/DataModels"
import { getLocalServerConfig, getAllPushClients } from "../../../model/LocaAPIs"
import { CommonState } from "../types"

const state: CommonState = {
    showQrCodeDialog: false,
    registerUrl: "",
    localServerConfig: {
        serverIP: null,
        proxyHttpPort: null,
        proxySocketPort: null,
        apiDefineServer: null,
        statRuleServer: null,
        dataProxyServer: null,
        dataProxyStatus: false
    },
    clientInfos: []
};

let pushClient: PushClient = null;

export const getters: GetterTree<CommonState, any> = {};

// async
export const actions: ActionTree<CommonState, any> = {
    init(context: { commit: Commit }): void {
        pushClient = new PushClient(store);
        if (process.env.NODE_ENV != 'production') {
            updateBaseDomain(process.env.SERVER_BASE_URL);
        }
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

        if (process.env.NODE_ENV == 'production' && process.env.SERVER_BASE_URL) {
            state.registerUrl = `${process.env.SERVER_BASE_URL}/mw/register?_=0__0&uid=${uid}`;
            pushClient.start(`${process.env.SERVER_BASE_URL}`, uid);
        } else {
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
