import Vue from 'vue'
import { ActionTree, Commit, GetterTree, MutationTree, Store } from 'vuex'
import { ipcRenderer } from "electron"
import { Message } from 'element-ui'

import store from "../"
import { CommonState } from '../types'
import { CMDCode } from '../../../model/DataModels'

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
        ip: "",
        port: "",
    },
};

function generateUid() {
    let len = 8;
    let res = [];
    for (let i = 0; i !== len; ++i) {
        res.push(String.fromCharCode(Math.floor(Math.random() * 26) + (Math.random() > 0.5 ? 65 : 97)));
    }
    res.push(new Date().getTime() + 'o');
    return res.join('');
}

function onGetLocalServerIP(event: any, data: any) {
    store.commit("updateLocalServerConfig", data);
}

function handleMsg(data: any) {
    let msg = JSON.parse(data);
    switch (msg.code) {
        case CMDCode.REGISTER_SUCCESS:
            store.commit("updateShowQrCodeDialog", false);
            Message({ message: '设备[' + msg.data + ']注册成功', type: "success" });
            break;
        case CMDCode.REQUEST_START:
            msg.data.type = CMDCode.REQUEST;
            store.commit("ProxyRecords/requestStart", msg.data);
            break;
        case CMDCode.REQUEST_END:
            msg.data.type = CMDCode.REQUEST;
            store.commit("ProxyRecords/requestEnd", msg.data);
            break;
        case CMDCode.STATISTICS:
            msg.data.type = CMDCode.STATISTICS;

            for (let i = 0; i != msg.data.statistics.bps.length; i++) {
                let temp = this.clone(msg.data)
                temp.statistics.bps = []
                temp.statistics.bps.push(msg.data.statistics.bps[i])
                store.commit("ProxyRecords/addStatistics", temp);
            }

            break;
        default:
            Message({ message: 'unhandled code:' + msg.code, type: "warning" });
    }
}

export const getters: GetterTree<CommonState, any> = {

    showQrCodeDialog(state: CommonState):boolean {
        return state.showQrCodeDialog;
    },
    registerUrl(state: CommonState): string {
        let uid = generateUid();
        return ['http://', state.localServerConfig.ip, ':', state.localServerConfig.port, '/mw/register?_=0__0&uid=', uid].join('');
    }
}

// async
export const actions: ActionTree<CommonState, any> = {
    init({ commit, state, rootState }): void {
        ipcRenderer.on("get-local-server-config", onGetLocalServerIP);
        ipcRenderer.send("get-local-server-config");
    },
    updateNavBarConfig(context: { commit: Commit }, params: Object): void {
        context.commit("updateNavBarConfig", params);
    },
    updateRegisterIP(context: { commit: Commit }, params: { ip: string, port: string }): void {
        context.commit("updateRegisterIP", params);
    },
    sendMessage(context, message) {
        console.log('send msg');
        // Vue.prototype.$socket.send(message);
    },
    unInit({ commit, state, rootState }): void {
        ipcRenderer.removeAllListeners("get-local-server-config");
    }
}

// sync
export const mutations: MutationTree<CommonState> = {
    updateShowQrCodeDialog(state, display) {
        state.showQrCodeDialog = display;
    },
    updateNavBarConfig(state, navBarConfig) {
        state.navBarConfig = Object.assign({}, navBarConfig);
    },
    updateLocalServerConfig(state, params) {
        state.localServerConfig.ip = params.registerIp;
        state.localServerConfig.port = params.customPort;
        let uid = generateUid();
        state.registerUrl = ['http://', params.registerIp, ':', params.customPort, '/mw/register?_=0__0&uid=', uid].join('');

        Vue.prototype.$socket.onmessage = (stream: any) => {
            handleMsg(stream.data);
        };
    },
}

export default {
    namespaced: false,
    state,
    getters,
    actions,
    mutations
}
