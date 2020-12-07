import axios from 'axios';

import { BACKEND_ORIGIN } from '../configuration';

/**
 * Check token validity
 * @returns {Promise<boolean>}
 */
export default async (token) => {
  try {
    await axios({
      headers: {
        Authorization: token,
      },
      method: 'GET',
      url: `${BACKEND_ORIGIN}/api/user`,
    });
    return true;
  } catch (error) {
    return false;
  }
};
