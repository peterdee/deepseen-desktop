import * as actionTypes from './action-types';

export default {
  addTrack({ commit }, payload) {
    return commit(actionTypes.PLAYLIST_ADD_TRACK, payload);
  },
  clearPlaylist({ commit }) {
    return commit(actionTypes.PLAYLIST_CLEAR_PLAYLIST);
  },
  deleteTrack({ commit }, payload) {
    return commit(actionTypes.PLAYLIST_DELETE_TRACK, payload);
  },
};
