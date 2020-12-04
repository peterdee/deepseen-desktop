import * as actionTypes from './action-types';

export default {
  /**
   * Switch loading status
   * @param {*} commit - commit function
   * @param {boolean} payload - payload
   * @returns {void}
   */
  setLoading({ commit }, payload) {
    return commit(actionTypes.ACCOUNT_MODAL_SET_VISIBILITY, payload);
  },
  /**
   * Set Account modal visibility
   * @param {*} commit - commit function
   * @param {boolean} payload - payload
   * @returns {void}
   */
  setVisibility({ commit }, payload) {
    return commit(actionTypes.ACCOUNT_MODAL_SET_VISIBILITY, payload);
  },
};
