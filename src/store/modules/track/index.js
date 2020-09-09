import actions from './actions';
import getters from './getters';
import mutations from './mutations';

// initial state
export const state = {
  muted: false,
  track: {
    added: '',
    available: false,
    duration: null,
    id: '',
    name: '',
    path: '',
    size: null,
    type: '',
    url: '',
  },
  volume: 1,
};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
};
