
/**
 *  locationHandler
 *  Handles
 *  Parkingspots/Chargingspots
 */
const locationHandler = {


    fetchAllLocations: async function fetchAllLocations() {
        try {
        const stockholm  = await this.fetchStockholmLocations()
        const goteborg  = await this.fetchGoteborgLocations()
        const malmo  = await this.fetchMalmoLocations()
        let data = stockholm.concat(goteborg)
        data = data.concat(malmo)
        return data
        }catch (error) {
            console.log("error")
            console.log(error)
        }
    },

    fetchStockholmLocations: async function fetchStockholmLocations() {
        const response = await fetch('http://192.168.1.239:3500/city/stockholm/parking')
        const data = await response.json();
        return data
    },
    fetchGoteborgLocations: async function fetchGoteborgLocations() {
        const response = await fetch('http://192.168.1.239:3500/city/goteborg/parking')
        const data = await response.json();
        return data
    },
    fetchMalmoLocations: async function fetchMalmoLocations() {
        const response = await fetch('http://192.168.1.239:3500/city/malmo/parking')
        const data = await response.json();
        return data
    }
}
module.exports = locationHandler;