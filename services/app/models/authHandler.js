import Constants from 'expo-constants';
import { GITHUB_CLIENT_ID } from '@env';

const API_KEY = require('../api-key.json');

const { manifest } = Constants;
const url = manifest.hostUri.split(':').shift().concat(':3500');

const authHandler = {

  /**
   * Fetches id of user.
   *
   * @async
   * @param {string} token - github token
   * @returns {Object} returns object containing information about the user
   */
  getGitHubUser: async function getGitHubUser(token) {
    const response = await fetch(`http://${url}/v1/getGitHubUser`, {
      headers: {
        'x-access-token': token,
        'x-api-key': API_KEY.key,
      },
    });
    const data = await response.json();
    return data.content;
  },

  /**
   * Fetches request device code from github.
   *
   * @async
   * @returns {Object} returns object containing device code;
   */
  req: async function req() {
    const response = await fetch('https://github.com/login/device/code', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
      }),
    });
    const data = await response.json();
    return data;
  },

  /**
   * Fetches id of user.
   *
   * @async
   * @param {string} req - req is returned from github when authorized
   * @param {string} req.device_code - req is returned from github when authorized
   * @returns {Object} returns object containing token
   */
  checkForAuth: async function checkForAuth(req) {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        device_code: req.device_code,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
      }),
    });
    const data = await response.json();
    return data;
  },
};

module.exports = authHandler;
