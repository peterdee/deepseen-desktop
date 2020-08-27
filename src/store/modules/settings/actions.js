import * as actionTypes from './action-types';

export default {
  /**
   * Set playlist looping
   * @param {*} commit - commit function
   * @param {boolean} payload - payload
   * @returns {void}
   */
  setLoopPlaylist({ commit }, payload) {
    return commit(actionTypes.SETTINGS_LOOP_PLAYLIST, payload);
  },
  /**
   * Set playlist shuffling
   * @param {*} commit - commit function
   * @param {boolean} payload - payload
   * @returns {void}
   */
  setPlaylistShuffling({ commit }, payload) {
    return commit(actionTypes.SETTINGS_SHUFFLE_PLAYLIST, payload);
  },
};
