/**
 * Delete playlist
 * @returns {void} 
 */
export const deletePlaylist = () => localStorage.removeItem('playlist');

/**
 * Get playlist
 * @returns {object[]|[]} 
 */
export const getPlaylist = () => {
  const playlist = localStorage.getItem('playlist');

  // check if playlist exists and it is a string
  if (!playlist || (playlist && typeof playlist !== 'string')) {
    return [];
  }

  // make sure that it's a valid JSON
  try {
    const parsed = JSON.parse(playlist);
    return parsed;
  } catch {
    return [];
  }
};

/**
 * Save playlist
 * @param {object[]} playlist - array of tracks
 * @returns {void} 
 */
export const savePlaylist = (
  playlist = [],
) => localStorage.setItem('playlist', JSON.stringify(playlist));
