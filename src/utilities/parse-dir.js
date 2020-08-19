import { lookup } from 'mime-types';
import { promises as fs } from 'fs';

import checkPath from './check-path';
import getFileExtension from './get-file-extension';

/**
 * Parse the directory recursively
 * @param {string} path - path to an item
 * @param {string[]} allowedExtensions - array of the allowed file extensions 
 * @param {object[]} results - array of results
 * @returns {object[]|[]|Error} 
 */
async function parse(path = '', allowedExtensions = [], results = []) {
  try {
    const items = await fs.readdir(path);

    if (items.length === 0) {
      return [];
    }

    const itemTypes = await Promise.all(items.map((item = '') => checkPath(`${path}/${item}`)));
    const localData = items.reduce((arr, item, i) => {
      // leave only the allowed extensions
      const extension = getFileExtension(item);
      if (itemTypes[i].isFile && !allowedExtensions.includes(extension)) {
        return arr;
      }

      arr.push({
        id: Date.now(),
        isDirectory: itemTypes[i].isDirectory,
        isFile: itemTypes[i].isFile,
        name: item,
        path: `${path}/${item}`,
        size: itemTypes[i].size,
        type: lookup(extension),
      });
      return arr;
    }, []);

    const combinedData = [...results, ...localData];

    // create a loop if there's a directory
    const dirs = combinedData.filter(({ isDirectory = false }) => isDirectory);
    if (dirs.length > 0) {
      return parse(
        dirs[0].path,
        allowedExtensions,
        combinedData.filter(({ path = '' }) => path !== dirs[0].path),
      );
    }

    return combinedData;
  } catch (error) {
    return error;
  }
}

export default parse;
