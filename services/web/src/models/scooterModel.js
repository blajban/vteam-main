const {apiKey} = require('../../../api-key.json');

const scooterModel = {

    fetchStockholmScooter: async function fetchStockholmScooter() {
        const response = await fetch('http://localhost:3500/v1/city/stockholm/Scooter', {
            headers: {
                'x-api-key': apiKey
            },
        })
        const data = await response.json();
        return data
    },
    fetchGoteborgScooter: async function fetchGoteborgScooter() {
        const response = await fetch('http://localhost:3500/v1/city/goteborg/Scooter', {
            headers: {
                'x-api-key': apiKey
            },
        })
        const data = await response.json();
        return data
    },
    fetchMalmoScooter: async function fetchMalmoScooter() {
        const response = await fetch('http://localhost:3500/v1/city/malmo/Scooter', {
            headers: {
                'x-api-key': apiKey
            },
        })
        const data = await response.json();
        return data
    },

    addScooter: async (loginId, token, city, scooterData) => {
        const response = await fetch(`http://localhost:3500/v1/city/${city.current.value}/scooter/${loginId}`, {
            body: JSON.stringify({
                lng: scooterData.lng.current.value,
                lat: scooterData.lat.current.value
            }),
            headers: {
                'content-type': 'application/json',
                'x-access-token': token,
                'x-api-key': apiKey
            },
            method: "POST"
        });
        console.log(response)
    },

    updateScooter: async (loginId, token, scooterId, city, status, location, lat, lng) => {
        const response = await fetch(`http://localhost:3500/v1/city/${city}/scooter/${scooterId}/${loginId}`, {
            body: JSON.stringify({
                status: status.current.value,
                location: location.current.value,
                lng: lng.current.value,
                lat: lat.current.value
            }),
            headers: {
                'content-type': 'application/json',
                'x-access-token': token,
                'x-api-key': apiKey
            },
            method: "PUT"
        });
        console.log(response)
    },

    removeScooter: async (loginId, token, scooterId, city) => {
        const response = await fetch(`http://localhost:3500/v1/city/${city}/scooter/${scooterId}/${loginId}`, {
            body: JSON.stringify({}),
            headers: {
                'content-type': 'application/json',
                'x-access-token': token,
                'x-api-key': apiKey
            },
            method: "DELETE"
        });
        console.log(response)
    }
}

export default scooterModel;