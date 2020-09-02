import * as actionTypes from './action-types';

export default {
  /**
   * Commit changes
   * @param {*} state - Context Menu state 
   * @param {number|string} trackId - payload
   * @returns {void}
   */
  [actionTypes.CONTEXT_MENU_SET_TRACK_ID](state, trackId = '') {
    state.trackId = trackId;
  },
  /**
   * Commit changes
   * @param {*} state - Context Menu state 
   * @param {boolean} visibility - payload
   * @returns {void}
   */
  [actionTypes.CONTEXT_MENU_SET_VISIBILITY](state, visibility = false) {
    state.visibility = visibility;
  },
};
