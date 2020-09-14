import * as actionTypes from './action-types';

export default {
  /**
   * Commit About visibility
   * @param {*} state - Settings state 
   * @param {boolean} visibility - payload
   * @returns {void}
   */
  [actionTypes.ABOUT_SET_VISIBILITY](state, visibility = false) {
    state.visibility = visibility;
  },
};
