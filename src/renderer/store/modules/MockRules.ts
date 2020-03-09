import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { MockRule } from '../../../model/DataModels';


import "reflect-metadata"
import { Expose, Type, plainToClass } from "class-transformer"
import ProxyRecords from './ProxyRecords';

import { MockRuleState } from '../types';

const state: MockRuleState = {
    rules: []
};

const getters: GetterTree<MockRuleState, any> = {
    mockRules(state: MockRuleState): Array<MockRule> {
        return state.rules;
    }
};

// async
export const actions: ActionTree<MockRuleState, any> = {
    addRule({ commit }, data: MockRule) {
        commit("addMockRule", data);
    }
}

// sync
const mutations: MutationTree<MockRuleState> = {

    addMockRule(state, data: MockRule) {
        state.rules = state.rules.concat(data);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
