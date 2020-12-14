import actions from './actions';
import mutations from './mutations';

// initial state
export const state = {
  email: '',
  firstName: '',
  formError: '',
  id: '',
  isAuthenticated: false,
  isLoading: false,
  lastName: '',
  token: '',
  visiblity: false,
};

export default {
  actions,
  mutations,
  namespaced: true,
  state,
};
