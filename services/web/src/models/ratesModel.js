const api_key = require('../api-key.json')

const locationModel = {
    /**
     * Retrieves the current rates from the server.
     *
     * @async
     * @returns {Object} - The current rates.
     */
    fetchRates: async function fetchRates() {
        const response = await fetch('http://localhost:3500/v1/rates',
        {
            headers: {
                'x-api-key': api_key.key,
            },
        });
        const data = await response.json();
        return data
    },
    /**
     * Creates a new rate.
     *
     * @param {Object} newRate - The new rate to be added.
     *
     * @async
     * @returns {Object} - The response from the server.
     */
    createRate: async function createRate(newRate) {
        const response = await fetch(`http://localhost:3500/v1/rates`, {
            body: JSON.stringify({newRate: newRate}),
            headers: {
                'content-type': 'application/json',
                'x-api-key': api_key.key,
            },
            method: 'POST'
        });
        const data = await response.json();
        return data
    },
    /**
     * Updates an existing rate.
     *
     * @param {string} _id - The ID of the rate to be updated.
     * @param {Object} updatedRate - The updated rate data.
     *
     * @async
     * @returns {Object} - The response from the server.
     */
    updateRate: async function updateRate(_id, updatedRate) {
        const response = await fetch(`http://localhost:3500/v1/rates`, {
            body: JSON.stringify({_id: _id, object:updatedRate}),
            headers: {
                'content-type': 'application/json',
                'x-api-key': api_key.key,
            },
            method: 'PUT'
        });
        const data = await response.json();
        return data
    },

    /**
     * Deletes an existing rate.
     *
     * @param {string} _id - The ID of the rate to be deleted.
     *
     * @async
     * @returns {Object} - The response from the server.
     */
    deleteRate: async function deleteRate(_id) {
        const response = await fetch(`http://localhost:3500/v1/rates`, {
            body: JSON.stringify({_id:_id}),
            headers: {
                'content-type': 'application/json',
                'x-api-key': api_key.key,
            },
            method: 'DELETE'
        });
        const data = await response.json();
        return data
    }
}

export default locationModel;