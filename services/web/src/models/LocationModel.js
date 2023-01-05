const api_key = require('../api-key.json')

const locationModel = {

    /**
     * Retrieves location data for all cities from the server.
     *
     * @async
     * @returns {Object} - The retrieved location data for Stockholm.
     */
    fetchAllLocations: async function fetchAllLocations() {
        const stockholm  = await this.fetchStockholmLocations()
        const goteborg  = await this.fetchGoteborgLocations()
        const malmo  = await this.fetchMalmoLocations()
        let data = stockholm.concat(goteborg)
        data = data.concat(malmo)
        return data
    },

    /**
     * Retrieves location data for Stockholm from the server.
     *
     * @async
     * @returns {Object} - The retrieved location data for Stockholm.
     */
    fetchStockholmLocations: async function fetchStockholmLocations() {
        const response = await fetch('http://localhost:3500/v1/city/stockholm/parking',
        {
            headers: {
                'x-api-key': api_key.key,
            },
        });
        const data = await response.json();
        return data
    },

    /**
     * Retrieves location data for Göteborg from the server.
     *
     * @async
     * @returns {Object} - The retrieved location data for Stockholm.
     */
    fetchGoteborgLocations: async function fetchGoteborgLocations() {
        const response = await fetch('http://localhost:3500/v1/city/goteborg/parking',
        {
            headers: {
                'x-api-key': api_key.key,
            },
        });
        const data = await response.json();
        return data
    },

    /**
     * Retrieves location data for Malmö from the server.
     *
     * @async
     * @returns {Object} - The retrieved location data for Stockholm.
     */
    fetchMalmoLocations: async function fetchMalmoLocations() {
        const response = await fetch('http://localhost:3500/v1/city/malmo/parking',
        {
            headers: {
                'x-api-key': api_key.key,
            },
        });
        const data = await response.json();
        return data
    },

    /**
     * Creates a new location in the specified city.
     *
     * @param {string} city - The city to add the new location to.
     * @param {Object} newLocation - The new location to be added.
     *
     * @async
     * @returns {Object} - The response from the server.
     */
    createLocation: async function createLocation(city, newLocation) {
        const response = await fetch(`http://localhost:3500/v1/city/${city}/parking`, {
            body: JSON.stringify({location: city, object:newLocation}),
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
     * Updates an existing location in the specified city.
     *
     * @param {string} city - The city containing the location to be updated.
     * @param {Object} updateLocation - The updated location data.
     *
     * @async
     * @returns {Object} - The response from the server.
     */
    updateLocation: async function updateLocation(city, updateLocation) {
        const response = await fetch(`http://localhost:3500/v1/city/${city}/parking`, {
            body: JSON.stringify({location: city, object:updateLocation}),
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
     * Deletes an existing location in the specified city.
     *
     * @param {string} city - The city containing the location to be deleted.
     * @param {string} deleteLocation - The ID of the location to be deleted.
     *
     * @async
     * @returns {Object} - The response from the server.
     */
    deleteLocation: async function updateLocation(city, deleteLocation) {
        const response = await fetch(`http://localhost:3500/v1/city/${city}/parking`, {
            body: JSON.stringify({location: city, object:{_id: deleteLocation}}),
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