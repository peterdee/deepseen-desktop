import * as actionTypes from './action-types';

export default {
  setTrackId({ commit }, payload) {
    return commit(actionTypes.CONTEXT_MENU_SET_TRACK_ID, payload);
  },
  setVisibility({ commit }, payload) {
    return commit(actionTypes.CONTEXT_MENU_SET_VISIBILITY, payload);
  },
};
