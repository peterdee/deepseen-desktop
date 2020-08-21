import actions from './actions';
import mutations from './mutations';

// initial state
export const state = {
  visibility: false,
  trackId: '',
};

export default {
  actions,
  mutations,
  namespaced: true,
  state,
};
