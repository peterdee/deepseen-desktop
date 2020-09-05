import * as actionTypes from './action-types';

export default {
  /**
   * Add track to the playback queue
   * @param {*} commit - commit function
   * @param {*} state - Playback Queue state
   * @param {string} payload - payload
   * @returns {void}
   */
  addTrack({ commit, state }, payload = '') {
    const { queue = [] } = state;
    return commit(
      actionTypes.PLAYBACK_QUEUE_SET_QUEUE,
      [
        ...queue,
        payload,
      ],
    );
  },
  /**
   * Clear playback queue
   * @param {*} commit - commit function
   * @returns {void}
   */
  clearQueue({ commit }) {
    return commit(actionTypes.PLAYBACK_QUEUE_SET_QUEUE, []);
  },
  /**
   * Delete track from the playback queue
   * @param {*} commit - commit function
   * @param {*} state - Playback Queue state
   * @param {string} payload - payload
   * @returns {void}
   */
  deleteTrack({ commit, state }, payload = '') {
    const { queue = [] } = state;
    return commit(
      actionTypes.PLAYBACK_QUEUE_SET_QUEUE,
      queue.filter((id) => id !== payload),
    );
  },
};
