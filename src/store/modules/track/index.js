import actions from './actions';
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
  mutations,
  namespaced: true,
  state,
};
