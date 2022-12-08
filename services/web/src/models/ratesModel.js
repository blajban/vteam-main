

const locationModel = {

    fetchRates: async function fetchRates() {
        const response = await fetch('http://localhost:3500/rates')
        const data = await response.json();
        return data
    },
    createRate: async function createRate(newRate) {
        const response = await fetch(`http://localhost:3500/rates`, {
            body: JSON.stringify(newRate),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
        });
        const data = await response.json();
        return data
    },
    updateRate: async function updateRate(updatedRate) {
        const response = await fetch(`http://localhost:3500/rates`, {
            body: JSON.stringify(updatedRate),
            headers: {
                'content-type': 'application/json'
            },
            method: 'PUT'
        });
        const data = await response.json();
        return data
    },
    deleteRate: async function deleteRate(delteRate) {
        const response = await fetch(`http://localhost:3500/rates`, {
            body: JSON.stringify(delteRate),
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