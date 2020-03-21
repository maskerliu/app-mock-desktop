import Vue from "vue"
import { ActionTree, Commit, GetterTree, MutationTree, Store } from "vuex"
import { ipcRenderer } from "electron"
import VueNativeSocket from "vue-native-websocket"
import { Message } from "element-ui"

import store from "../"
import { CommonState, IP } from "../types"
import { CMDCode } from "../../../model/DataModels"

const SocketConfig = {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
    format: "json",
    connectManually: true,
};
Vue.use(VueNativeSocket, 'ws://localhost:8889', SocketConfig);
const vm = new Vue();

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
        serverPort: null,
        websocketPort: null,
        ips: []
    },
};

function generateUid() {
    let len = 8;
    let res = [];
    for (let i = 0; i !== len; ++i) {
        res.push(String.fromCharCode(Math.floor(Math.random() * 26) + (Math.random() > 0.5 ? 65 : 97)));
    }
    res.push(new Date().getTime() + "o");
    return res.join("");
}

function handleMsg(data: any) {
    let msg = JSON.parse(data);
    switch (msg.code) {
        case CMDCode.REGISTER_SUCCESS:
            store.commit("updateShowQrCodeDialog", false);
            Message({ message: "设备[" + msg.data + "]注册成功", type: "success" });
            break;
        case CMDCode.REQUEST_START:
            msg.data.type = CMDCode.REQUEST_START;
            store.commit("ProxyRecords/requestStart", msg.data);
            break;
        case CMDCode.REQUEST_END:
            msg.data.type = CMDCode.REQUEST_END;
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
            Message({ message: "unhandled code:" + msg.code, type: "warning" });
    }
}

export const getters: GetterTree<CommonState, any> = {

}

// async
export const actions: ActionTree<CommonState, any> = {
    init(context: { commit: Commit }): void {
        ipcRenderer.on("get-local-server-config", (event: any, data: any)=>{
            store.commit("updateLocalServerConfig", data);
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
        state.localServerConfig.serverIP = params.serverIP;
        state.localServerConfig.serverPort = params.serverPort;
        state.localServerConfig.websocketPort = params.websocketPort;
        state.localServerConfig.ips = params.localIPs;
        let uid = generateUid();
        state.registerUrl = ["http://", params.serverIP, ":", params.serverPort, "/appmock/register?_=0__0&uid=", uid].join("");

        try {
            vm.$disconnect();
        } catch(err) {
            console.log(err);
        }
        
        vm.$connect(`ws://localhost:${params.websocketPort}`, SocketConfig);
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
