import { Commit } from 'vuex';
const state: any = {
  menulist: [],
};

const mutations: any = {
  saveMenuList(states: any, params: object) {
    states.menulist = params;
    console.log("mutation save menu list");
  },
};

const actions: any = {
  saveMenuListFN(context: { commit: Commit }, params: object) {
    context.commit('saveMenuList', params);
    console.log("action save menu list fn");
  },
};

export default {
  namespaced: true, // namespaced为false的时候，state,mutations,actions全局可以调用，为true，生成作用域，引用时要声明模块名称
  state,
  mutations,
  actions,
};