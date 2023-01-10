import Constants from 'expo-constants';

const API_KEY = require('../api-key.json');

const { manifest } = Constants;
const url = manifest.hostUri.split(':').shift().concat(':3500');

const authHandler = {

  /**
   * Fetches information about the user.
   *
   * @async
   * @param {string} city - specified city to fetch locations from
   * @returns {Object} returns object containing information about the user.
   */
  getUser: async function getUser(token, userId, loginId) {
    if (!token) return 'No token specified';
    if (!userId) return 'No userid specified';
    if (!loginId) return 'No loginId specified';
    const response = await fetch(`http://${url}/v1/users/${loginId}/${userId}`, {
      headers: {
        'x-access-token': token,
        'x-api-key': API_KEY.key,
      },
    });
    const data = await response.json();
    return data;
  },

  /**
   * Updates users information in database.
   *
   * @async
   * @param {string} token - github token
   * @param {object} user - Object containing information about user
   * @param {string} login - users logIn id
   * @returns {Object} returns object containing information about the user
   */
  updateUser: async function updateUser(token, user, loginId) {
    if (!token) return 'No token specified';
    if (!user) return 'No userid specified';
    if (!loginId) return 'No loginId specified';
    const response = await fetch(`http://${url}/v1/users/${loginId}/${user._id}`, {
      body: JSON.stringify(user),
      headers: {
        'content-type': 'application/json',
        'x-access-token': token,
        'x-api-key': API_KEY.key,
      },
      method: 'PUT',
    });

    await response.json();
  },
};

module.exports = authHandler;
