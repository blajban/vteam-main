
const scooterModel = {

    fetchStockholmScooter: async function fetchStockholmScooter() {
        const response = await fetch('http://localhost:3500/city/stockholm/Scooter')
        const data = await response.json();
        return data
    },
    fetchGoteborgScooter: async function fetchGoteborgScooter() {
        const response = await fetch('http://localhost:3500/city/goteborg/Scooter')
        const data = await response.json();
        return data
    },
    fetchMalmoScooter: async function fetchMalmoScooter() {
        const response = await fetch('http://localhost:3500/city/malmo/Scooter')
        const data = await response.json();
        return data
    },

    addScooter: async (city, scooterData) => {
        const response = await fetch(`http://localhost:3500/city/${city.current.value}/scooter`, {
            body: JSON.stringify({
                lng: scooterData.lng.current.value,
                lat: scooterData.lat.current.value
            }),
            headers: {
                "content-type": "application/json"
            },
            method: "POST"
        });
        console.log(response)
    },

    updateScooter: async (scooterId, city, status, location, lat, lng) => {
        const response = await fetch(`http://localhost:3500/city/${city}/scooter/${scooterId}`, {
            body: JSON.stringify({
                status: status.current.value,
                location: location.current.value,
                lng: lng.current.value,
                lat: lat.current.value
            }),
            headers: {
                "content-type": "application/json"
            },
            method: "PUT"
        });
        console.log(response)
    },

    removeScooter: async (scooterId, city) => {
        const response = await fetch(`http://localhost:3500/city/${city}/scooter/${scooterId}`, {
            body: JSON.stringify({}),
            headers: {
                "content-type": "application/json"
            },
            method: "DELETE"
        });
        console.log(response)
    }
}

export default scooterModel;