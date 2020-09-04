import * as actionTypes from './action-types';

export default {
  /**
   * Commit changes
   * @param {*} state - Playlist state 
   * @param {object[]} tracks - payload
   * @returns {void}
   */
  [actionTypes.PLAYLIST_ADD_MULTIPLE_TRACKS](state, tracks = []) {
    state.tracks = [...tracks];
  },
  /**
   * Commit changes
   * @param {*} state - Playlist state 
   * @param {object} track - payload
   * @returns {void}
   */
  [actionTypes.PLAYLIST_ADD_TRACK](state, track = {}) {
    state.tracks = [...state.tracks, track];
  },
  /**
   * Commit changes
   * @param {*} state - Playlist state 
   * @returns {void}
   */
  [actionTypes.PLAYLIST_CLEAR_PLAYLIST](state) {
    state.tracks = [];
  },
  /**
   * Commit changes
   * @param {*} state - Playlist state 
   * @param {string} trackId - payload
   * @returns {void}
   */
  [actionTypes.PLAYLIST_DELETE_TRACK](state, trackId = '') {
    state.tracks = state.tracks.filter(({ id = '' }) => id !== trackId);
  },
  /**
   * Commit changes
   * @param {*} state - Playlist state 
   * @param {object[]} tracks - payload
   * @returns {void}
   */
  [actionTypes.PLAYLIST_RANDOMIZE_TRACKS](state, tracks = []) {
    state.tracks = [...tracks];
  },
  /**
   * Commit changes
   * @param {*} state - Playlist state 
   * @param {string[]} ids - payload
   * @returns {void}
   */
  [actionTypes.PLAYLIST_RESHUFFLE](state, ids = []) {
    state.shuffled = ids;
  },
  /**
   * Commit changes
   * @param {*} state - Playlist state 
   * @param {string[]} ids - payload
   * @returns {void}
   */
  [actionTypes.PLAYLIST_SET_SHUFFLED](state, ids = []) {
    state.shuffled = ids;
  },
};
