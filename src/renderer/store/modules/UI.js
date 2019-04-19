const state = {
    showMockConfig: {
        show: false,
    }
};

const getters = {
    showMockConfig: state => {
        return state.showMockConfig;
    }
};

const actions = {
    updateShowMockConfig({state, commit}, obj) {
        commit('updateShowConfig', obj);
    }
};


const mutations = {
    updateShowConfig(state, obj) {
        state.showMockConfig = obj;
    }
};


export default {
    namespaced: false,
    state,
    getters,
    actions,
    mutations
}
