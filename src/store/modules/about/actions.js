import * as actionTypes from './action-types';

export default {
  /**
   * Set About visibility
   * @param {*} commit - commit function
   * @param {boolean} payload - payload
   * @returns {void}
   */
  setVisibility({ commit }, payload) {
    return commit(actionTypes.ABOUT_SET_VISIBILITY, payload);
  },
};
