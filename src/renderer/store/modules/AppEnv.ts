import { ActionTree, MutationTree } from "vuex";
import { AppState } from "../types";

const pkgInfo = require("../../../../package.json");

const state: AppState = {
  appInfo: {
    env: "test",
    version: pkgInfo.version,
    bundleId: pkgInfo.build.appId,
  }
};

export const actions: ActionTree<AppState, any> = {
  init({ commit }, data?: any) {
    return new Promise((resolve, reject) => {
      return resolve(1);
    });
  },
};

const mutations: MutationTree<AppState> = {
  updateEnv(state, env: string) {
    state.appInfo.env = env;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
