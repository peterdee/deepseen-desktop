import { lookup } from 'mime-types';

import generateId from './generate-id';
import getFileExtension from './get-file-extension';
import getFileName from './get-file-name';

/**
 * Parse a single file
 * @param {string} path - path to the file
 * @param {number} size - file size in bytes
 * @param {string[]} allowedExtensions - allowed extensions
 * @returns {object|null} 
 */
export default (path = '', size = 0, allowedExtensions = []) => {
  // check file extension first
  const extension = getFileExtension(path);
  if (!allowedExtensions.includes(getFileExtension(path))) {
    return null;
  }

  return {
    added: Date.now(),
    available: true,
    id: generateId(),
    isDirectory: false,
    isFile: true,
    name: getFileName(path),
    path,
    size,
    type: lookup(extension),
  };
};
