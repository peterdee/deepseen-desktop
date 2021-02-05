import axios from 'axios';

import {
  BACKEND_ORIGIN,
  CLIENT_TYPE,
  RESPONSE_MESSAGES,
  STATUS_CODES,
} from '../../../configuration';
import * as actionTypes from './action-types';

export default {
  /**
   * Set form error
   * @param {*} commit - commit function
   * @param {string} payload - payload
   * @returns {void}
   */
  setFormError({ commit }, payload) {
    return commit(actionTypes.ACCOUNT_MODAL_SET_ERROR, payload);
  },
  /**
   * Switch loading status
   * @param {*} commit - commit function
   * @param {boolean} payload - payload
   * @returns {void}
   */
  setLoading({ commit }, payload) {
    return commit(actionTypes.ACCOUNT_MODAL_SET_LOADING, payload);
  },
  /**
   * Set Account modal visibility
   * @param {*} commit - commit function
   * @param {boolean} payload - payload
   * @returns {void}
   */
  setVisibility({ commit }, payload) {
    return commit(actionTypes.ACCOUNT_MODAL_SET_VISIBILITY, payload);
  },
  /**
   * Sign user in
   * @param {*} commit - commit  
   * @param {string} email - email address
   * @param {string} password - password
   * @returns {Promise<void>} 
   */
  async signIn({ commit }, { email = '', password = '' }) {
    commit(actionTypes.ACCOUNT_MODAL_SET_LOADING, true);
    try {
      const { data: { data = {} } = {} } = await axios({
        data: {
          client: CLIENT_TYPE,
          email,
          password,
        },
        method: 'POST',
        url: `${BACKEND_ORIGIN}/api/auth/signin`,
      });
      
      if (!(data.user && data.token)) {
        return commit(
          actionTypes.ACCOUNT_MODAL_SET_ERROR,
          'Whoops! Something\'s went wrong...',
        );
      }

      return commit(
        actionTypes.ACCOUNT_MODAL_SET_ACCOUNT,
        {
          email: data.user.email,
          firstName: data.user.firstName,
          id: data.user.id,
          lastName: data.user.lastName,
          token: data.token,
        },
      );
    } catch (error) {
      commit(actionTypes.ACCOUNT_MODAL_SET_LOADING, false);
      const { response: { data = {} } = {} } = error;
      if (data && data.info && data.status) {
        if (data.info === RESPONSE_MESSAGES.accessDenied
          && data.status === STATUS_CODES.unauthorized) {
          return commit(
            actionTypes.ACCOUNT_MODAL_SET_ERROR,
            'Access denied!',
          );
        }
        if (data.info === RESPONSE_MESSAGES.tooManyRequests
          && data.status === STATUS_CODES.tooManyRequests) {
          return commit(
            actionTypes.ACCOUNT_MODAL_SET_ERROR,
            'Too many requests! Repeat in 5 minutes!',
          );
        }
      }

      return commit(
        actionTypes.ACCOUNT_MODAL_SET_ERROR,
        'Whoops! Something went wrong...',
      );
    }
  },
  /**
   * Sign out
   * @param {*} commit - commit  
   * @returns {Promise<void>} 
   */
  async signOut({ commit }) {
    return commit(actionTypes.ACCOUNT_MODAL_SIGN_OUT);
  },
};
