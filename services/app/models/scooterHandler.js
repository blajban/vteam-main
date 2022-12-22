/**
 *  Scooter
 *  Handles
 *  Scooters
 */
const scooterHandler = {


    fetchStockholmScooters: async function fetchStockholmScooters() {
        const response = await fetch('http://192.168.1.239:3500/city/stockholm/scooter')
        const data = await response.json();
        return data
    },
    fetchGoteborgScooters: async function fetchGoteborgScooters() {
        const response = await fetch('http://192.168.1.239:3500/city/goteborg/scooter')
        const data = await response.json();
        return data
    },
    fetchMalmoScooters: async function fetchMalmoScooters() {
        const response = await fetch('http://192.168.1.239:3500/city/malmo/scooter')
        const data = await response.json();
        return data
    }
}
module.exports = scooterHandler;