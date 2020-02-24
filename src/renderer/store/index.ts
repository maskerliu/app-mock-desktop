import Vue from 'vue'
import Vuex from 'vuex'

// import { createPersistedState, createSharedMutations } from 'vuex-electron'

import Env from "./modules/Env"
import Common from "./modules/Common"
import MockRules from "./modules/MockRules"
import PorxyRecords from "./modules/ProxyRecords"

import modules from './modules'

Vue.use(Vuex);

export default new Vuex.Store({
  modules,
  plugins: [
    // createPersistedState(),
    // createSharedMutations()
  ],
  strict: false// process.env.NODE_ENV !== 'production'
})
