import Constants from 'expo-constants';

const API_KEY = require('../api-key.json');

const { manifest } = Constants;
const url = manifest.hostUri.split(':').shift().concat(':3500');

const locationHandler = {

  /**
   * fetches locations.
   *
   * @async
   * @param {string} city - specified city to fetch locations from
   * @param {string} token - github token
   * @returns {(Object[]|null)} returns array of objects , or null if an error occurred.
   */
  fetchLocations: async function fetchLocations(city, token) {
    if (!city) return 'No city specified';
    if (!token) return 'No token specified';
    try {
      const response = await fetch(`http://${url}/v1/city/${city}/parking`, {
        headers: {
          'x-access-token': token,
          'x-api-key': API_KEY.key,
        },
      });
      const data = await response.json();
      return data;
    } catch (e) {
      return [{}];
    }
  },
  /**
   * fetches rates.
   *
   * @async
   * @param {string} token - github token
   * @returns {(Object[]|null)} returns array of objects , or null if an error occurred.
   */
  fetchRates: async function fetchRates(token) {
    if (!token) return 'No token specified';
    try {
      const response = await fetch(`http://${url}/v1/rates`, {
        headers: {
          'x-access-token': token,
          'x-api-key': API_KEY.key,
        },
      });
      const data = await response.json();
      return data;
    } catch (e) {
      return [{}];
    }
  },
};

module.exports = locationHandler;
