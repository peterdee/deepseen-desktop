import * as actionTypes from './action-types';

export default {
  setVisibility({ commit }, payload) {
    return commit(actionTypes.PLAYLIST_ACTIONS_SET_VISIBILITY, payload);
  },
};
