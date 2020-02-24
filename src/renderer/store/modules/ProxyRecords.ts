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

        console.log(JSON.parse(data));
        let msg = JSON.parse(data);
        switch (msg.code) {
            case CMDCode.REGISTER_SUCCESS:
                Message({ message: '设备[' + msg.data + ']注册成功', type: "success" });
                break;
            case CMDCode.REQUEST_START:
                context.commit("requestStart", msg.data);
                break;
            case CMDCode.REQUEST_END:
                context.commit("requestEnd", msg.data);
                break;
            case CMDCode.STATISTICS:
                context.commit("addStatistics", msg.data);
                // for (let i = 0; i != msg.data.statistics.bps.length; i++) {
                //     let tmp = this.clone(msg.data)
                //     tmp.statistics.bps = []
                //     tmp.statistics.bps.push(msg.data.statistics.bps[i])
                //     commit("addStatistics", tmp);
                // }
                break;
            default:
                Message({ message: 'unhandled code:' + msg.code, type: "warning" });
        }
    }
}

// sync
const mutations: MutationTree<ProxyRecordState> = {

    requestStart(state, obj) {

        console.log("request start");
        let recordJson = {
            id: "00012",
            method: "Get",
            url: "/v1/userprofile",
            time: 410,
            statusCode: 200,
            requestHeader: {
                "array": [1, 2, 3],
                "boolean": true,
                "null": null,
                "number": 123,
                "object": { "a": "b", "c": "d" },
                "string": "Hello World",
                "X-Client": "android",
            },
            responseHeader: {
                "X-Client": "android",
                "X-Token": "sdflaf-adsfladfn02134-1324lakdf"
            },
            responseData: {
                "code": 8000,
                "name": "chris",
                "gender": "female",
                "uid": "dsfaldno183134",
                "did": "13q9ru9q8124",
                "X-Token8": "sdflaf-adsfladfn02134-1324lakdf",
                "X-Token9": "sdflaf-adsfladfn02134-1324lakdf",
                "data": {
                    "X-Token0": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token11": "sdflaf-adsfladfn02134-1324lakdf",
                    "thumb": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                    "X-Token1": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token2": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token3": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token31": "sdflaf-adsfladfn02134-1324lakdf",
                },
                "test": [
                    1,
                    2,
                    4
                ],
                "thumb1": "http://a4.att.hudong.com/68/38/01300534501725138544388872742.jpg",
                "X-Token33": "sdflaf-adsfladfn02134-1324lakdf",
                "X-Token29": "sdflaf-adsfladfn02134-1324lakdf",
                "X-Token10": "sdflaf-adsfladfn02134-1324lakdf",
                "X-Token12": "sdflaf-adsfladfn02134-1324lakdf",
                "thumb2": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                "X-Token28": "sdflaf-adsfladfn02134-1324lakdf",
                "X-Token19": "sdflaf-adsfladfn02134-1324lakdf",
                "X-Token01": "sdflaf-adsfladfn02134-1324lakdf",
                "X-Token21": "sdflaf-adsfladfn02134-1324lakdf",
                "thumb3": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                "X-Token18": "sdflaf-adsfladfn02134-1324lakdf",
                "X-Token39": "sdflaf-adsfladfn02134-1324lakdf",
                "X-Token30": "sdflaf-adsfladfn02134-1324lakdf",
                "X-Token32": "sdflaf-adsfladfn02134-1324lakdf",
                "thumb4": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                "X-Token48": "sdflaf-adsfladfn02134-1324lakdf",
                "X-Token49": "sdflaf-adsfladfn02134-1324lakdf",
                "X-Token40": "sdflaf-adsfladfn02134-1324lakdf",
                "X-Token41": "sdflaf-adsfladfn02134-1324lakdf",
                "thumb14": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg"
            }
        };

        let record: ProxyRequestRecord = plainToClass(ProxyRequestRecord, recordJson, { excludeExtraneousValues: true });
        record.id = "00000120";
        state.records.push(record);

        record = plainToClass(ProxyRequestRecord, recordJson, { excludeExtraneousValues: true });
        record.id = "00000121";
        state.records.push(record);
        record = plainToClass(ProxyRequestRecord, recordJson, { excludeExtraneousValues: true });
        record.id = "00000122";
        state.records.push(record);
    },
    requestEnd(state, obj) {

    },
    addStatistics(state, obj) {
        let recordJson = {
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
