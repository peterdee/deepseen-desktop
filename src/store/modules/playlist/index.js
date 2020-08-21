import actions from './actions';
import getters from './getters';
import mutations from './mutations';

// initial state
export const state = {
  tracks: [],
};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
};
