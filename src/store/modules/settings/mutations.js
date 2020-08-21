import * as actionTypes from './action-types';

export default {
  [actionTypes.SETTINGS_LOOP_PLAYLIST](state, setting = false) {
    state.loop = setting;
  },
};
