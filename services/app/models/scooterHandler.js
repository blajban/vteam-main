/**
 *  Scooter
 *  Handles
 *  Scooters
 */
const scooterHandler = {


    fetchScooters: async function fetchScooters(city) {
        const response = await fetch(`http://192.168.1.239:3500/city/${city}/scooter`)
        const data = await response.json();
        return data
    },
    rentScooter: async function rentScooter(scooterId, userId) {
        const response = await fetch(`http://192.168.1.239:3500/eventflows/rent_scooter/${scooterId}/${userId}`)
        const data = await response.json();
        return data
    },
    parkScooter: async function parkScooter(scooterId) {
        const response = await fetch(`http://192.168.1.239:3500/eventflows/park_scooter/${scooterId}`)
        const data = await response.json();
        return data
    },
}
module.exports = scooterHandler;