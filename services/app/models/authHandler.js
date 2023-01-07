import Constants from 'expo-constants';

const API_KEY = require('../api-key.json');

const { manifest } = Constants;
const url = manifest.hostUri.split(':').shift().concat(':3500');

const authHandler = {
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
};

module.exports = authHandler;
