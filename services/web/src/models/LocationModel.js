const {apiKey} = require('../../../api-key.json');

const locationModel = {
    fetchAllLocations: async function fetchAllLocations() {
        const stockholm  = await this.fetchStockholmLocations()
        const goteborg  = await this.fetchGoteborgLocations()
        const malmo  = await this.fetchMalmoLocations()
        let data = stockholm.concat(goteborg)
        data = data.concat(malmo)
        return data
    },

    fetchStockholmLocations: async function fetchStockholmLocations() {
        const start = new Date();
        console.log(start)
        const response = await fetch('http://localhost:3500/city/stockholm/parking', {
            headers: {
                'x-api-key': apiKey
            },
        })
        const timeTaken = (new Date()) - start
        console.log(timeTaken, " miliseconds");
        const data = await response.json();
        return data
    },
    fetchGoteborgLocations: async function fetchGoteborgLocations() {
        const response = await fetch('http://localhost:3500/v1/city/goteborg/parking', {
            headers: {
                'x-api-key': apiKey
            },
        })
        const data = await response.json();
        return data
    },
    fetchMalmoLocations: async function fetchMalmoLocations() {
        const response = await fetch('http://localhost:3500/v1/city/malmo/parking', {
            headers: {
                'x-api-key': apiKey
            },
        })
        const data = await response.json();
        return data
    },
    createLocation: async function createLocation(loginId, token, city, newLocation) {
        const response = await fetch(`http://localhost:3500/v1/city/${city}/parking/${loginId}`, {
            body: JSON.stringify({location: city, object:newLocation}),
            headers: {
                'content-type': 'application/json',
                'x-access-token': token,
                'x-api-key': apiKey
            },
            method: 'POST'
        });
        const data = await response.json();
        return data
    },
    updateLocation: async function updateLocation(loginId, token, city, updateLocation) {
        const response = await fetch(`http://localhost:3500/v1/city/${city}/parking/${loginId}`, {
            body: JSON.stringify({location: city, object:updateLocation}),
            headers: {
                'content-type': 'application/json',
                'x-access-token': token,
                'x-api-key': apiKey
            },
            method: 'PUT'
        });
        const data = await response.json();
        return data
    },
    deleteLocation: async function updateLocation(loginId, token, city, deleteLocation) {
        const response = await fetch(`http://localhost:3500/v1/city/${city}/parking/${loginId}`, {
            body: JSON.stringify({location: city, object:{_id: deleteLocation}}),
            headers: {
                'content-type': 'application/json',
                'x-access-token': token,
                'x-api-key': apiKey
            },
            method: 'DELETE'
        });
        const data = await response.json();
        return data
    }
}

export default locationModel;