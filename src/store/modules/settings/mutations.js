import * as actionTypes from './action-types';

export default {
  /**
   * Commit playlist looping
   * @param {*} state - Settings state 
   * @param {boolean} loop - payload
   * @returns {void}
   */
  [actionTypes.SETTINGS_LOOP_PLAYLIST](state, loop = false) {
    state.loop = loop;
  },
};
