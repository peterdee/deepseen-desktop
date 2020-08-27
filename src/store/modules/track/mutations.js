import * as actionTypes from './action-types';
import { state as initialState } from './index';

export default {
  /**
   * Commit track clear
   * @param {*} state - Track state 
   * @returns {void}
   */
  [actionTypes.TRACK_CLEAR_TRACK](state) {
    state.track = { ...initialState.track };
  },
  /**
   * Commit new track
   * @param {*} state - Track state 
   * @param {*} track - track to set
   * @returns {void}
   */
  [actionTypes.TRACK_SET_TRACK](state, track = {}) {
    state.track = { ...track };
  },
  /**
   * Commit track volume
   * @param {*} state - Track state 
   * @param {number} volume - track volume
   * @returns {void}
   */
  [actionTypes.TRACK_SET_VOLUME](state, volume = 0) {
    state.volume = volume;
  },
};
