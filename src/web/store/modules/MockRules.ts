import { ActionTree, GetterTree, MutationTree } from "vuex";
import { MockRule } from "../../../model/DataModels";
import { MockRuleState } from "../types";

const state: MockRuleState = {
  showEditMockRuleDialog: false,
  showDeleteMockRuleDialog: false,
  curRule: null,
};

const getters: GetterTree<MockRuleState, any> = {};

export const actions: ActionTree<MockRuleState, any> = {};

const mutations: MutationTree<MockRuleState> = {
  setCurRule(state, data: MockRule) {
    state.curRule = data;
  },
  setShowEditMockRuleDialog(state, isShow: boolean) {
    state.showEditMockRuleDialog = isShow;
  },
  setShowDeleteMockRuleDialog(state, isShow: boolean) {
    state.showDeleteMockRuleDialog = isShow;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
