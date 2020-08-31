import * as actionTypes from './action-types';

export default {
  /**
   * Clear current track
   * @param {*} commit - commit function
   * @returns {void}
   */
  clearTrack({ commit }) {
    return commit(actionTypes.TRACK_CLEAR_TRACK);
  },
  /**
   * Set muted state
   * @param {*} commit - commit function
   * @param {boolean} payload - muted state
   * @returns {void}
   */
  setMuted({ commit }, payload) {
    return commit(actionTypes.TRACK_SET_MUTED, payload);
  },
  /**
   * Set current track
   * @param {*} commit - commit function
   * @param {object} payload - track object
   * @returns {void}
   */
  setTrack({ commit }, payload) {
    return commit(actionTypes.TRACK_SET_TRACK, payload);
  },
  /**
   * Set track volume
   * @param {*} commit - commit function
   * @param {number} payload - track volume
   * @returns {void}
   */
  setVolume({ commit }, payload) {
    return commit(actionTypes.TRACK_SET_VOLUME, payload);
  },
};
