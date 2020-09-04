import * as actionTypes from './action-types';

export default {
  /**
   * Add track to the playback queue
   * @param {*} commit - commit function
   * @param {string} payload - payload
   * @returns {void}
   */
  addTrack({ commit }, payload = '') {
    return commit(actionTypes.PLAYBACK_QUEUE_ADD_TRACK, payload);
  },
  /**
   * Clear playback queue
   * @param {*} commit - commit function
   * @returns {void}
   */
  clearQueue({ commit }) {
    return commit(actionTypes.PLAYBACK_QUEUE_CLEAR_QUEUE);
  },
  /**
   * Delete track from the playback queue
   * @param {*} commit - commit function
   * @param {string} payload - payload
   * @returns {void}
   */
  deleteTrack({ commit }, payload = '') {
    return commit(actionTypes.PLAYBACK_QUEUE_DELETE_TRACK, payload);
  },
};
