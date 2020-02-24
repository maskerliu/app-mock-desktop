import {ipcRenderer} from 'electron'

const state = {
    env: 'test',
}

const actions = {
    init({ commit }) {
        return new Promise((resolve, reject) => {
            return resolve(1);
        })
    }
}

const mutations = {
    updateState(state, payload) {
        Object.keys(payload).forEach(key => state[key] = payload[key])
    },
    updateEnv(state, payload) {
        state.env = payload
    },
}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
}