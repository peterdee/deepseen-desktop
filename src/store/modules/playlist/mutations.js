import * as actionTypes from './action-types';

export default {
  [actionTypes.PLAYLIST_ADD_TRACK](state, track = {}) {
    state.tracks = [...state.tracks, track];
  },
  [actionTypes.PLAYLIST_CLEAR_PLAYLIST](state) {
    state.tracks = [];
  },
  [actionTypes.PLAYLIST_DELETE_TRACK](state, trackId = '') {
    state.tracks = state.tracks.filter(({ id = '' }) => id !== trackId);
  },
};
