import * as actionTypes from './action-types';

export default {
  /**
   * Commit new error message
   * @param {*} state - Playback Error state 
   * @param {string} message - error message
   * @returns {void}
   */
  [actionTypes.PLAYBACK_ERROR_SET_ERROR](state, message = '') {
    state.message = message;
  },
};
