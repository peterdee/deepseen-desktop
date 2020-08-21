import * as actionTypes from './action-types';

export default {
  setLoopPlaylist({ commit }, payload) {
    return commit(actionTypes.SETTINGS_LOOP_PLAYLIST, payload);
  },
};
