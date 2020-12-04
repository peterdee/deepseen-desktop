import * as actionTypes from './action-types';

export default {
  /**
   * Commit changes
   * @param {*} state - Context Menu state 
   * @param {boolean} isLoading - payload
   * @returns {void}
   */
  [actionTypes.ACCOUNT_MODAL_SET_VISIBILITY](state, isLoading = false) {
    state.isLoading = isLoading;
  },
  /**
   * Commit changes
   * @param {*} state - Context Menu state 
   * @param {boolean} visibility - payload
   * @returns {void}
   */
  [actionTypes.ACCOUNT_MODAL_SET_VISIBILITY](state, visibility = false) {
    state.visibility = visibility;
  },
};
