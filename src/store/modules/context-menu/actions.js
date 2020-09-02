import * as actionTypes from './action-types';

export default {
  /**
   * Set track ID for the context menu
   * @param {*} commit - commit function
   * @param {boolean} payload - payload
   * @returns {void}
   */
  setTrackId({ commit }, payload) {
    return commit(actionTypes.CONTEXT_MENU_SET_TRACK_ID, payload);
  },
  /**
   * Set context menu visibility
   * @param {*} commit - commit function
   * @param {boolean} payload - payload
   * @returns {void}
   */
  setVisibility({ commit }, payload) {
    return commit(actionTypes.CONTEXT_MENU_SET_VISIBILITY, payload);
  },
};
