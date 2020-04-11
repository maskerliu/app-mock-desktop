import Vue from "vue"
import { ActionTree, Commit, GetterTree, MutationTree } from "vuex"

import { ProxyRecordState } from "../types"
import { CMDCode, ProxyStatRecord, ProxyRequestRecord } from "../../../model/DataModels"


const state: ProxyRecordState = {
    records: []
};

const getters: GetterTree<ProxyRecordState, any> = {
    proxyRecords(state: ProxyRecordState): Array<ProxyStatRecord | ProxyRequestRecord> {
        return state.records;
    }
};

// async
export const actions: ActionTree<ProxyRecordState, any> = {
    clearRecords(context: { commit: Commit, state: ProxyRecordState }, data: any) {
        context.commit("clearRecords");
    }
}

// sync
const mutations: MutationTree<ProxyRecordState> = {

    requestStart(state, record: ProxyRequestRecord) {
        if (state.records.length > 20) {
            state.records.splice(0, 10);
        }
        try {
            state.records.push(record);
        } catch (err) {
            console.error(err);
        }
    },
    requestEnd(state, record: ProxyRequestRecord) {
        for (let i = 0; i < state.records.length; ++i) {
            let anchor: ProxyRequestRecord = <ProxyRequestRecord>state.records[i];
            if (anchor != null && anchor.id === record.id) {
                Vue.set(state.records[i], "isMock", record.isMock);
                Vue.set(state.records[i], "type", record.type);
                Vue.set(state.records[i], "responseHeaders", record.responseHeaders);
                Vue.set(state.records[i], "responseData", JSON.parse(record.responseData));
                Vue.set(state.records[i], "statusCode", record.statusCode);
                Vue.set(state.records[i], "time", record.time);
                break;
            }
        }
    },
    addStatistics(state, obj) {
        let recordJson = {
            type: CMDCode.STATISTICS,
            id: "00000123",
            app_id: "string",
            app_version: "string",
            os: "string",
            rule: "string",
            pageId: "string",
            elementId: "string",
            event_id: "string",
            arg1: "string",
            arg2: "string",
            arg3: "string",
            args: "string",
            desc: "string"
        };
        // let record: ProxyStatRecord = plainToClass(ProxyStatRecord, recordJson, { excludeExtraneousValues: true });
        // state.records.push(record);
    },
    clearRecords(state, params?: any): void {
        state.records.splice(0, state.records.length);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
