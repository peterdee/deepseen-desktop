import actions from './actions';
import getters from './getters';
import mutations from './mutations';

// initial state
export const state = {
  track: {
    duration: null,
    id: '',
    name: '',
    path: '',
    size: null,
    type: '',
    url: '',
  },
};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
};
