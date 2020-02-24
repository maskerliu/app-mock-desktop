import { ActionTree, Commit, GetterTree, MutationTree } from 'vuex'
import { CommonState, NavTest } from '../types';

const state: CommonState = {
    navTest: {
        title: "hellworld"
    },
    navBarConfig: {
        leftItem: false,
        leftCallback: null,
        rightItem: false,
        rightCallback: null,
        title: "",
    }
};

export const getters: GetterTree<CommonState, any> = {
    fullName(state: CommonState): string {
        return state.navTest.title;
    }
}

// async
export const actions: ActionTree<CommonState, any> = {
    updateNavBarConfig(context: { commit: Commit }, params: Object): void {
        console.log("update nav bar config");
        context.commit("updateNavBarConfig", params);
    }
}

// sync
export const mutations: MutationTree<CommonState> = {
    updateNavBarConfig(state, navBarConfig) {
        console.log("mutation update navbarconfig data");
        state.navBarConfig = Object.assign({}, navBarConfig);
    }
}

export default {
    namespaced: false,
    state,
    getters,
    actions,
    mutations
}
