

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
        const response = await fetch('http://localhost:3500/city/stockholm/parking')
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
            body: JSON.stringify(newLocation),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
        });
        const data = await response.json();
        return data
    },
    updateLocation: async function updateLocation(city, updatedLocation) {
        const response = await fetch(`http://localhost:3500/city/${city}/parking`, {
            body: JSON.stringify(updatedLocation),
            headers: {
                'content-type': 'application/json'
            },
            method: 'PUT'
        });
        const data = await response.json();
        return data
    },
    deleteLocation: async function updateLocation(city, deleteLocation) {
        console.log("tjohej")
        const response = await fetch(`http://localhost:3500/city/${city}/parking`, {
            body: JSON.stringify(deleteLocation),
            headers: {
                'content-type': 'application/json'
            },
            method: 'DELETE'
        });
        const data = await response.json();
        console.log(data)
        return data
    }
}

export default locationModel;