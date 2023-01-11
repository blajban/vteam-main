const api_key = require('../api-key.json');
const scooterModel = {

    fetchStockholmScooter: async function fetchStockholmScooter(token, loginId) {
        const response = await fetch(`http://localhost:3500/v1/city/stockholm/scooter`,
        {
            headers: {
                'x-api-key': api_key.key,
                'x-access-token': token,
            },
        });
        const data = await response.json();
        console.log(data);
        return data
    },
    fetchGoteborgScooter: async function fetchGoteborgScooter(token, loginId) {
        const response = await fetch(`http://localhost:3500/v1/city/goteborg/scooter`,
        {
            headers: {
                'x-api-key': api_key.key,
                'x-access-token': token,
            },
        });
        const data = await response.json();
        console.log(data);
        return data
    },
    fetchMalmoScooter: async function fetchMalmoScooter(token, loginId) {
        const response = await fetch(`http://localhost:3500/v1/city/malmo/scooter`,
        {
            headers: {
                'x-api-key': api_key.key,
                'x-access-token': token,
            },
        });
        const data = await response.json();
        console.log(data);
        return data
    },

    addScooter: async (token, loginId, city, scooterData) => {
        const response = await fetch(`http://localhost:3500/city/${city.current.value}/scooter/${loginId}`, {
            body: JSON.stringify({
                lng: scooterData.lng.current.value,
                lat: scooterData.lat.current.value
            }),
            headers: {
                'content-type': 'application/json',
                'x-access-token': token,
                'x-api-key': api_key.key,
            },
            method: "POST"
        });
        console.log(response)
    },

    updateScooter: async (token, loginId, scooterId, city, status, location, lat, lng) => {
        const response = await fetch(`http://localhost:3500/city/${city}/scooter/${scooterId}/${loginId}`, {
            body: JSON.stringify({
                status: status.current.value,
                location: location.current.value,
                lng: lng.current.value,
                lat: lat.current.value
            }),
            headers: {
                'content-type': 'application/json',
                'x-access-token': token,
                'x-api-key': api_key.key,
            },
            method: "PUT"
        });
        console.log(response)
    },

    removeScooter: async (token, loginId, scooterId, city) => {
        const response = await fetch(`http://localhost:3500/city/${city}/scooter/${scooterId}/${loginId}`, {
            body: JSON.stringify({}),
            headers: {
                'content-type': 'application/json',
                'x-access-token': token,
                'x-api-key': api_key.key,
            },
            method: "DELETE"
        });
        console.log(response)
    }
}

export default scooterModel;