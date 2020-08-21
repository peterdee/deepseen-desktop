export default {
  /**
   * Get a single track by track ID
   * @param {string} trackId - track ID
   * @returns {object|null}
   */
  getTrack: ({ tracks = [] }) => (trackId = '') => {
    if (tracks.length === 0) {
      return null;
    }

    const [track = null] = tracks.filter(({ id = '' }) => id === trackId);
    return track;
  },
  /**
   * Get track IDs
   * @returns {string[]}
   */
  getTrackIds: ({ tracks = [] }) => tracks.map(({ id = '' }) => id),
};
