/**
 * Get file name
 * @param {string} path - full file path
 * @returns {string}
 */
export default (path = '') => path.includes('/') ? path.split('/').slice(-1)[0] : path;
