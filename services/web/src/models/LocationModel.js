

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
        const response = await fetch('http://localhost:3500/city/stockholm/parking')
        const timeTaken = (new Date()) - start
        console.log(timeTaken, " miliseconds");
        const data = await response.json();
        return data
    },
    fetchGoteborgLocations: async function fetchGoteborgLocations() {
        const response = await fetch('http://localhost:3500/city/goteborg/parking')
        const data = await response.json();
        return data
    },
    fetchMalmoLocations: async function fetchMalmoLocations() {
        const response = await fetch('http://localhost:3500/city/malmo/parking')
        const data = await response.json();
        return data
    },
    createLocation: async function createLocation(city, newLocation) {
        const response = await fetch(`http://localhost:3500/city/${city}/parking`, {
            body: JSON.stringify({location: city, object:newLocation}),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
        });
        const data = await response.json();
        return data
    },
    updateLocation: async function updateLocation(city, updateLocation) {
        const response = await fetch(`http://localhost:3500/city/${city}/parking`, {
            body: JSON.stringify({location: city, object:updateLocation}),
            headers: {
                'content-type': 'application/json'
            },
            method: 'PUT'
        });
        const data = await response.json();
        return data
    },
    deleteLocation: async function updateLocation(city, deleteLocation) {
        const response = await fetch(`http://localhost:3500/city/${city}/parking`, {
            body: JSON.stringify({location: city, object:{_id: deleteLocation}}),
            headers: {
                'content-type': 'application/json'
            },
            method: 'DELETE'
        });
        const data = await response.json();
        return data
    }
}

export default locationModel;