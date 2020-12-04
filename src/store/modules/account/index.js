import actions from './actions';
import mutations from './mutations';

// initial state
export const state = {
  email: '',
  isAuthenticated: false,
  isLoading: false,
  name: '',
  token: '',
  visiblity: false,
};

export default {
  actions,
  mutations,
  namespaced: true,
  state,
};
