/**
 * Get the previous track ID
 * @param {string[]} trackIds - array of track IDs
 * @param {string} currentId - currently playing track ID
 * @param {boolean} loop - loop playlist
 * @returns {string|null}
 */
export default (trackIds = [], currentId = '', loop = false) => {
  // check the array of available IDs
  if (trackIds.length === 0) {
    return null;
  }

  // if there's no currently playing track
  const lastId = trackIds[trackIds.length - 1];
  if (!currentId) {
    return lastId;
  }

  // find the next track ID
  const previousTrackID = trackIds[trackIds.indexOf(currentId) - 1];
  if (previousTrackID) {
    return previousTrackID;
  }

  // get the ID of the last track in the playlist if loop is enabled
  if (loop) {
    return lastId;
  }

  return null;
};
