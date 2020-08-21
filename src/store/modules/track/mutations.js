import * as actionTypes from './action-types';
import { state as initialState } from './index';

export default {
  [actionTypes.TRACK_CLEAR_TRACK](state) {
    state.track = { ...initialState.track };
  },
  [actionTypes.TRACK_SET_TRACK](state, track = {}) {
    state.track = { ...track };
  },
};
