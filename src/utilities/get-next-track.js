/**
 * Get the next track ID
 * @param {string[]} trackIds - track IDs
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
  if (!currentId) {
    return trackIds[0];
  }

  // find the next track ID
  const nextTrackID = trackIds[trackIds.indexOf(currentId) + 1];
  if (nextTrackID) {
    return nextTrackID;
  }

  // get the ID of the first track in the playlist if loop is enabled
  if (loop) {
    return trackIds[0];
  }

  return null;
};
