import * as actionTypes from './action-types';

export default {
  [actionTypes.CONTEXT_MENU_SET_TRACK_ID](state, trackId = '') {
    state.trackId = trackId;
  },
  [actionTypes.CONTEXT_MENU_SET_VISIBILITY](state, visibility = false) {
    state.visibility = visibility;
  },
};
