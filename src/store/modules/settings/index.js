import actions from './actions';
import mutations from './mutations';

// initial state
export const state = {
  loop: true,
};

export default {
  actions,
  mutations,
  namespaced: true,
  state,
};
