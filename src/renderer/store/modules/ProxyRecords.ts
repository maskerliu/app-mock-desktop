import "reflect-metadata"
import { Expose, Type, plainToClass } from "class-transformer"

import { Message } from 'element-ui'
import { ActionTree, Commit, GetterTree, MutationTree } from 'vuex'

import { ProxyRecordState } from '../types'
import { CMDCode, ProxyStatRecord, ProxyRequestRecord } from '../../model/DataModels'


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
    handleRecords(context: { commit: Commit, state: ProxyRecordState }, data: any) {

    }
}

// sync
const mutations: MutationTree<ProxyRecordState> = {

    requestStart(state, obj) {
        let record: ProxyRequestRecord = plainToClass(ProxyRequestRecord, obj, { excludeExtraneousValues: true });
        if (state.records.length > 20) {
            state.records.splice(0, 10);
        }
        state.records.push(record);
    },
    requestEnd(state, obj) {
        let record: ProxyRequestRecord = plainToClass(ProxyRequestRecord, obj, { excludeExtraneousValues: true });
        for (let i = 0; i < state.records.length; ++i) {
            let anchor: ProxyRequestRecord = <ProxyRequestRecord>state.records[i];
            if (anchor != null && anchor.id === record.id) {
                anchor.responseHeaders= record.headers;
                anchor.responseData = JSON.parse(record.responseData);
                anchor.statusCode = record.statusCode;
                anchor.time = record.time;
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
        let record: ProxyStatRecord = plainToClass(ProxyStatRecord, recordJson, { excludeExtraneousValues: true });
        state.records.push(record);
    }

};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
