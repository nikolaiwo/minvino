import Vue from "vue";
import Vuex from "vuex";

import db from './modules/db';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {db},
});
