/**
 * Format track name: show extension in brackets
 * @param {string} name - track name
 * @param {boolean} showExtension - show or hide extension
 * @returns {string}
 */
export default (name = '', showExtension = true) => {
  if (name) {
    const [extension = '', ...rest] = name.split('.').reverse();
    return `${rest.reverse().join('.')}${showExtension ? ` [${extension.toUpperCase()}]` : ''}`;
  }

  return '';
};
