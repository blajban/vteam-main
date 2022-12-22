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
}
module.exports = scooterHandler;