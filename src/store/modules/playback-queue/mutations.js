import * as actionTypes from './action-types';

export default {
  /**
   * Commit changes
   * @param {*} state - Playback Queue state 
   * @param {string} id - payload
   * @returns {void}
   */
  [actionTypes.PLAYBACK_QUEUE_ADD_TRACK](state, id = '') {
    state.queue = [...state.queue, id];
  },
  /**
   * Commit changes
   * @param {*} state - Playback Queue state 
   * @returns {void}
   */
  [actionTypes.PLAYBACK_QUEUE_CLEAR_QUEUE](state) {
    state.queue = [];
  },
  /**
   * Commit changes
   * @param {*} state - Playlist state 
   * @param {string} id - payload
   * @returns {void}
   */
  [actionTypes.PLAYBACK_QUEUE_DELETE_TRACK](state, id = '') {
    state.queue = state.queue.filter((item = '') => item !== id);
  },
};
