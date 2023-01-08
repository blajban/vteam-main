import Constants from 'expo-constants';

const { manifest } = Constants;
const url = manifest.hostUri.split(':').shift().concat(':3500');
const API_KEY = require('../api-key.json');

/**
 *  Scooter
 *  Handles
 *  Scooters
 */
const scooterHandler = {

  /**
   * Fetches scooters available in the specified city.
   *
   * @async
   * @param {string} city - The city to fetch scooters for.
   * @returns {(Object[]|null)} An array of scooter objects, or null if an error occurred.
   */
  fetchScooters: async function fetchScooters(city, token) {
    if (!city) return 'No city specified';
    try {
      const response = await fetch(`http://${url}/v1/city/${city}/scooter`, {
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
   * Rents scooter.
   *
   * @async
   * @param {string} scooterId - specified scooter to rent
   * @param {string} userId - UserId.
   * @param {string} token - token.
   * @returns {(Object[]|null)} returns rentEvent started , or null if an error occurred.
   */
  rentScooter: async function rentScooter(scooterId, userId, token) {
    if (!scooterId) return 'No scooterId or UserId specified';
    if (!userId) return 'No scooterId or UserId specified';
    try {
      const response = await fetch(`http://${url}/v1/eventflows/rent_scooter/${scooterId}/${userId}/${userId}`, {
        headers: {
          'x-access-token': token,
          'x-api-key': API_KEY.key,
        },
      });
      const data = await response.json();
      return data;
    } catch (e) {
      return null;
    }
  },
  /**
   * Parks scooter.
   *
   * @async
   * @param {string} scooterId - specified scooter to rent
   * @param {string} userId - UserId.
   * @param {string} token - token.
   * @returns {(Object[]|null)} returns parkEvent started , or null if an error occurred.
   */
  parkScooter: async function parkScooter(scooterId, userId, token) {
    if (!scooterId) return 'No scooterId specified';
    try {
      const response = await fetch(`http://${url}/v1/eventflows/park_scooter/${scooterId}/${userId}`, {
        headers: {
          'x-access-token': token,
          'x-api-key': API_KEY.key,
        },
      });
      const data = await response.json();
      return data;
    } catch (e) {
      return null;
    }
  },
};

module.exports = scooterHandler;
