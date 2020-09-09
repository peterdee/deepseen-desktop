/**
 * Format track name: show extension in brackets
 * @param {string} name - track name
 * @returns {string}
 */
export default (name = '') => {
  if (name) {
    const [extension = '', ...rest] = name.split('.').reverse();
    return `${rest.reverse().join('.')} [${extension.toUpperCase()}]`;
  }

  return '';
};
