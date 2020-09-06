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
    state.shuffled = [];
    state.tracks = [];
  },
  /**
   * Commit changes
   * @param {*} state - Playlist state 
   * @param {string} trackId - payload
   * @returns {void}
   */
  [actionTypes.PLAYLIST_DELETE_TRACK](state, trackId = '') {
    state.shuffled = state.shuffled.filter(({ id = '' }) => id !== trackId);
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
   * @param {object[]} items - payload
   * @returns {void}
   */
  [actionTypes.PLAYLIST_RESHUFFLE](state, items = []) {
    state.shuffled = items;
  },
  /**
   * Commit changes
   * @param {*} state - Playlist state 
   * @param {object[]} items - payload
   * @returns {void}
   */
  [actionTypes.PLAYLIST_SET_SHUFFLED](state, items = []) {
    state.shuffled = items;
  },
  /**
   * Commit changes
   * @param {*} state - Playlist state 
   * @param {object[]} tracks - payload
   * @returns {void}
   */
  [actionTypes.PLAYLIST_SET_TRACKS](state, tracks = []) {
    state.tracks = [...tracks];
  },
};
