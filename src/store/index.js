/**
 * @author YASIN
 * @version [React-Native Ocj V01, 2018/7/22]
 * @date 17/2/23
 * @description index
 */
import Vue from 'vue';
import Vuex from 'vuex';
import moduleA from './a';
// window.Vue=Vue
Vue.use(Vuex)
let state = {
  count: 0
};
const actions = {
  increase({commit}) {
    commit('increase');
  },
  decrease({commit}) {
    commit('decrease');
  }
};
const mutations = {
  increase(state) {
    state.count++;
  },
  decrease(state) {
    state.count--;
  }
};
export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {
    a: moduleA
  },
  getters: {
    doneTodos: state => {
      return state.count
    }
  }
});
