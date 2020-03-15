import Vue from 'vue'
import Vuex from 'vuex'

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
