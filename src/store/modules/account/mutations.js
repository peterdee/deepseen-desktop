import * as actionTypes from './action-types';

export default {
  /**
   * Commit changes
   * @param {*} state - Account state 
   * @param {*} data - payload
   * @returns {void}
   */
  [actionTypes.ACCOUNT_MODAL_SET_ACCOUNT](state, data) {
    state.email = data.email;
    state.id = data.id;
    state.isAuthenticated = true;
    state.isLoading = false;
    state.name = data.name;
    state.token = data.token;
  },
  /**
   * Commit changes
   * @param {*} state - Account state 
   * @param {string} formError - payload
   * @returns {void}
   */
  [actionTypes.ACCOUNT_MODAL_SET_ERROR](state, formError = '') {
    state.formError = formError;
  },
  /**
   * Commit changes
   * @param {*} state - Account state 
   * @param {boolean} isLoading - payload
   * @returns {void}
   */
  [actionTypes.ACCOUNT_MODAL_SET_LOADING](state, isLoading = false) {
    state.isLoading = isLoading;
  },
  /**
   * Commit changes
   * @param {*} state - Account state 
   * @param {boolean} visibility - payload
   * @returns {void}
   */
  [actionTypes.ACCOUNT_MODAL_SET_VISIBILITY](state, visibility = false) {
    state.visibility = visibility;
  },
  /**
   * Commit changes
   * @param {*} state - Account state 
   * @returns {void}
   */
  [actionTypes.ACCOUNT_MODAL_SIGN_OUT](state) {
    state.email = '';
    state.id = '';
    state.isAuthenticated = false;
    state.isLoading = false;
    state.name = '';
    state.token = '';
  },
};
