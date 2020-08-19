import { promises as fs } from 'fs';

/**
 * Check if provided path is a directory or is a file
 * @param {string} path - path to check
 * @returns {Promise<{ isDirectory: boolean, isFile: boolean, size: number }>}
 */
export default async (path = '') => {
  const stats = await fs.stat(path);
  return {
    isDirectory: stats.isDirectory(),
    isFile: stats.isFile(),
    size: stats.size,
  };
};
