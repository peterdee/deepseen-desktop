import * as actionTypes from './action-types';

export default {
  clearTrack({ commit }) {
    return commit(actionTypes.TRACK_CLEAR_TRACK);
  },
  setTrack({ commit }, payload) {
    return commit(actionTypes.TRACK_SET_TRACK, payload);
  },
};
