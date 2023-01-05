const {apiKey} = require('../../../api-key.json');

const locationModel = {

    fetchRates: async function fetchRates() {
        const response = await fetch('http://localhost:3500/v1/rates', {
            headers: {
                'x-api-key': apiKey
            },
        })
        const data = await response.json();
        return data
    },
    createRate: async function createRate(loginId, token, newRate) {
        const response = await fetch(`http://localhost:3500/v1/rates/${loginId}`, {
            body: JSON.stringify({newRate: newRate}),
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
    updateRate: async function updateRate(loginId, token, _id, updatedRate) {
        const response = await fetch(`http://localhost:3500/v1/rates/${loginId}`, {
            body: JSON.stringify({_id: _id, object:updatedRate}),
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
    deleteRate: async function deleteRate(loginId, token, _id) {
        const response = await fetch(`http://localhost:3500/v1/rates/${loginId}`, {
            body: JSON.stringify({_id:_id}),
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