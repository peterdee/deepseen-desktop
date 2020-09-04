// import randomize from './randomize';

/**
 * Get the next track ID
 * @param {string[]} trackIds - track IDs
 * @param {string} currentId - currently playing track ID
 * @param {boolean} loop - loop playlist
 * @param {boolean} shuffle - shuffle playlist
 * @param {string[]} shuffled - shuffled IDs
 * @returns {string|null}
 */
export default (
  trackIds = [],
  currentId = '',
  loop = false,
  // shuffle = false,
  // shuffled = [],
) => {
  // check the array of available IDs
  if (trackIds.length === 0) {
    return null;
  }

  // if shuffle is enabled
  // if (shuffle) {
  //   // if there's no currently playing track
  //   const [firstShuffled] = randomize(trackIds);
  //   if (!currentId) {
  //     return firstShuffled;
  //   }

  //   // find the next shufled track ID
  //   const nextShuffledID = shuffled[shuffled.indexOf(currentId) + 1];
  //   if (nextShuffledID) {
  //     return nextShuffledID;
  //   }

  //   // get the ID of the first track in the playlist if loop is enabled
  //   if (loop) {
  //     return firstShuffled;
  //   }

  //   return null;
  // }

  // if there's no currently playing track
  const [firstId] = trackIds; 
  if (!currentId) {
    return firstId;
  }

  // find the next track ID
  const nextTrackID = trackIds[trackIds.indexOf(currentId) + 1];
  if (nextTrackID) {
    return nextTrackID;
  }

  // get the ID of the first track in the playlist if loop is enabled
  if (loop) {
    return firstId;
  }

  return null;
};
