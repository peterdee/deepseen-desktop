import * as actionTypes from './action-types';

export default {
  [actionTypes.PLAYLIST_ACTIONS_SET_VISIBILITY](state, visibility = false) {
    state.visibility = visibility;
  },
};
