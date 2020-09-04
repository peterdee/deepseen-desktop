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
  shuffle = false,
  shuffled = [],
) => {
  // check if there are any tracks
  if (trackIds.length === 0) {
    return null;
  }

  // if shuffle is enabled
  if (shuffle) {
    // check if there are any tracks in the shuffled array
    if (shuffled.length === 0) {
      return 'reshuffle';
    }

    // check if there are any non-played tracks in the shuffled array
    const nonPlayed = shuffled.filter(({ played = false }) => !played);
    if (nonPlayed.length === 0) {
      if (loop) {
        return 'reshuffle';
      }
      return null;
    }

    // return the ID of the first non-played track
    return nonPlayed[0].id;
  }

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
