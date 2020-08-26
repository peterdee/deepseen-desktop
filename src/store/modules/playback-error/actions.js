import * as actionTypes from './action-types';

export default {
  /**
   * Set Playback Error message
   * @param {*} commit - commit function
   * @param {string} payload - error message
   * @returns {void}
   */
  setError({ commit }, payload) {
    return commit(actionTypes.PLAYBACK_ERROR_SET_ERROR, payload);
  },
};
