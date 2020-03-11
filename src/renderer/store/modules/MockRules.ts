import { ActionTree, Commit, GetterTree, MutationTree, Dispatch } from 'vuex';

import "reflect-metadata"
import { Expose, Type, plainToClass } from "class-transformer"
import PouchDB from "pouchdb"

import { MockRule } from '../../../model/DataModels';
import ProxyRecords from './ProxyRecords';

import { MockRuleState } from '../types';

let localDB = new PouchDB("AppMock");

const state: MockRuleState = {
    rules: []
};

const getters: GetterTree<MockRuleState, any> = {
    mockRules(state: MockRuleState): Array<MockRule> {
        console.log(state.rules);
        return state.rules;
    }
};

// async
export const actions: ActionTree<MockRuleState, any> = {
    fetchPagedMockRules(context: { commit: Commit }, page: number) {
        localDB.allDocs({
            include_docs: true,
            attachments: true
        }).then((response) => {
            let rules: Array<MockRule> = [];
            for (let i: number = 0; i < response.rows.length; ++i) {
                let rule: MockRule = plainToClass(MockRule, response.rows[i].doc, { excludeExtraneousValues: true });
                rules.push(rule);
            }
            context.commit("updateMockRules", rules);
        }).catch((error) => {
            console.log(error);
        })
    },
    searchMockRules(context: {commit: Commit}, keyword: string) {
        localDB.find({
            selector: {name: {$regex: `%${keyword}%`}},
            fields: ['name'],
          }).then(function (response) {
              console.log(response)
            // handle result
          }).catch(function (err) {
            console.log(err);
          });
    },
    saveMockRule(context: { commit: Commit, dispatch: Dispatch }, data: MockRule) {
        console.log(data);
        if (data._id === null || data._id === undefined) {
            localDB.post(data).then((response) => {
                context.dispatch("fetchPagedMockRules", 0);
            }).catch((err) => {
                console.log(err);
            });
        } else {
            localDB.get(data._id).then(function (doc) {
                let rule = Object.assign(data, { _rev: doc._rev });
                return localDB.put(rule);
            }).then(function (response) {
                console.log(response);
                context.dispatch("fetchPagedMockRules", 0);
            }).catch(function (err) {
                console.log(err);
            });
        }
    },
    deleteMockRule(context: { commit: Commit, dispatch: Dispatch }, ruleId: string) {
        localDB.get(ruleId).then(function (doc) {
            return localDB.remove(doc);
        }).then(function (result) {
            context.dispatch("fetchPagedMockRules", 0);
        }).catch(function (err) {
            console.log(err);
        });
    }
}

// sync
const mutations: MutationTree<MockRuleState> = {

    updateMockRules(state, data: MockRule | Array<MockRule>) {
        state.rules = [].concat(data);
        
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
