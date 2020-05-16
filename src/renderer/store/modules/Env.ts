import { ActionTree, GetterTree, MutationTree } from "vuex";
import { EnvState } from "../types";

const state: EnvState = {
  env: "test",
  appId: "",
  bundleId: "",
};

const getters: GetterTree<EnvState, any> = {
  env(state: EnvState): string {
    return state.env;
  },
};

export const actions: ActionTree<EnvState, any> = {
  init({ commit }, data?: any) {
    return new Promise((resolve, reject) => {
      return resolve(1);
    });
  },
};

const mutations: MutationTree<EnvState> = {
  updateState(state, payload: any) {
    Object.keys(payload).forEach((key) => (state[key] = payload[key]));
  },

  updateEnv(state, payload) {
    state.env = payload;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
