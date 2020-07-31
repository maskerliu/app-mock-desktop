import Vue from "vue";
import { ActionTree, Commit, GetterTree, MutationTree } from "vuex";
import {
  CMDCode,
  ProxyRequestRecord,
  ProxyStatRecord
} from "../../model/DataModels";
import { ProxyRecordState } from "./CommonStateModel";

const state: ProxyRecordState = {
  proxyTypes: [],
  records: [],
  curRecord: null,
};

const COLORS: string[] = [
  "#F44336",
  "#3F51B5",
  "#2196F3",
  "#00BCD4",
  "#009688",
  "#FF9800",
  "#795548",
  "#9C27B0",
  "#607D8B",
  "#673AB7"
];

const getters: GetterTree<ProxyRecordState, any> = {

};

// async
export const actions: ActionTree<ProxyRecordState, any> = {

};

// sync
const mutations: MutationTree<ProxyRecordState> = {
  setProxyTypes(state, proxyTypes) {
    state.proxyTypes = proxyTypes;
  },
  updateProxyRecords(state, record: ProxyRequestRecord) {

    if (record.type == CMDCode.REQUEST_START || record.type == CMDCode.REQUEST_END) {
      if (state.proxyTypes.indexOf(String(CMDCode.REQUEST)) == -1) return;
    } else if (record.type == CMDCode.STATISTICS || record.type == CMDCode.SOCKET) {
      if (state.proxyTypes.indexOf(String(record.type)) == -1) return;
    }

    switch (record.type) {
      case CMDCode.REQUEST_START:
      case CMDCode.STATISTICS:
        if (state.records.length > 40) {
          state.records.splice(state.records.length - 10, 10);
        }
        record._idx = record.id + "";
        record.timelineColor = COLORS[record.timestamp % 10];
        state.records.unshift(record);

        if (state.curRecord == null) return;

        let isExist = false;
        for (let i = 0; i < state.records.length; ++i) {
          if (state.records[i].id === state.curRecord.id) {
            isExist = true;
            break;
          }
        }
        if (!isExist) state.curRecord = null;
        break;
      case CMDCode.REQUEST_END:
        for (let i = 0; i < state.records.length; ++i) {
          let anchor: ProxyRequestRecord = <ProxyRequestRecord>state.records[i];
          if (anchor != null && anchor.id == record.id) {
            Vue.set(state.records[i], "isMock", record.isMock);
            Vue.set(state.records[i], "type", record.type);
            Vue.set(state.records[i], "responseHeaders", record.responseHeaders);
            try {
              Vue.set(state.records[i], "responseData", JSON.parse(record.responseData));
            } catch (err) {}
            
            Vue.set(state.records[i], "statusCode", record.statusCode);
            Vue.set(state.records[i], "time", record.time);
            break;
          }
        }
        break;
      default:
        console.log("unsupport record type");
    }
  },
  clearRecords(state, params?: any): void {
    state.records.splice(0, state.records.length);
  },
  setCurRecord(state, params: ProxyRequestRecord) {
    state.curRecord = params;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
