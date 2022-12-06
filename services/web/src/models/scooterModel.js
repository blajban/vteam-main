
const scooterModel = {

    fetchStockholmScooter: async function fetchStockholmScooter() {
        const response = await fetch('https://localhost:3500/city/stockholm/Scooter')
        const data = await response.json();
        return data
    },
    fetchGoteborgScooter: async function fetchGoteborgScooter() {
        const response = await fetch('https://localhost:3500/city/goteborg/Scooter')
        const data = await response.json();
        return data
    },
    fetchMalmoScooter: async function fetchMalmoScooter() {
        const response = await fetch('https://localhost:3500/city/malmo/Scooter')
        const data = await response.json();
        return data
    }
}

export default scooterModel;