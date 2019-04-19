import Vue from 'vue'
import Vuex from 'vuex'

import { createPersistedState, createSharedMutations } from 'vuex-electron'


import ui from './modules/UI'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    ui
  },
  plugins: [
    createPersistedState(),
    // createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== 'production'
})
