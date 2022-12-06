

const locationModel = {

    fetchStockholmLocations: async function fetchStockholmLocations() {
        const response = await fetch('https://localhost:3500/city/stockholm/parking')
        const data = await response.json();
        return data
    },
    fetchGoteborgLocations: async function fetchGoteborgLocations() {
        const response = await fetch('https://localhost:3500/city/goteborg/parking')
        const data = await response.json();
        return data
    },
    fetchMalmoLocations: async function fetchMalmoLocations() {
        const response = await fetch('https://localhost:3500/city/malmo/parking')
        const data = await response.json();
        return data
    }
}

export default locationModel;