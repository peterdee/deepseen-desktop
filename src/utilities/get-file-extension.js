/**
 * Get file extension
 * @param {string} name - file name or a full file path
 * @returns {string}
 */
export default (name = '') => {
  const isPath = name.includes('/');
  if (isPath) {
    const lastPathPartial = name.split('/').slice(-1)[0];
    return lastPathPartial.includes('.') ? lastPathPartial.split('.').slice(-1)[0] : '';
  }
  return name.includes('.') ? name.split('.').slice(-1)[0] : '';
};
