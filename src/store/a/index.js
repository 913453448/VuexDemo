/**
 * @author YASIN
 * @version [React-Native Ocj V01, 2018/7/31]
 * @date 17/2/23
 * @description index
 */
let state = {
  count: 10
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
export default {
  namespaced: true,
  state,
  actions,
  mutations,
}
