import Constants from 'expo-constants';

const API_KEY = require('../api-key.json');

const { manifest } = Constants;
const url = manifest.hostUri.split(':').shift().concat(':3500');

const authHandler = {

  /**
   * fetches locations.
   *
   * @async
   * @param {string} city - specified city to fetch locations from
   * @returns {(Object[]|null)} returns array of objects , or null if an error occurred.
   */
  getUser: async function getUser(token, userId, loginId) {
    const response = await fetch(`http://${url}/v1/users/${loginId}/${userId}`, {
      headers: {
        'x-access-token': token,
        'x-api-key': API_KEY.key,
      },
    });
    const data = await response.json();
    return data;
  },

  updateUser: async function updateUser(token, user, loginId) {
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
