import * as actionTypes from './action-types';

export default {
  /**
   * Commit changes
   * @param {*} state - Playback Queue state 
   * @param {string[]} queue - payload
   * @returns {void}
   */
  [actionTypes.PLAYBACK_QUEUE_SET_QUEUE](state, queue = []) {
    state.queue = [...queue];
  },
};
