const stockholm = require("../../../shared/location_service/stockholmLocations.json");
const goteborg = require("../../../shared/location_service/goteborgLocations.json");
const malmo = require("../../../shared/location_service/malmoLocations.json");

/**
 *  locationHandler
 *  Handles
 *  Parkingspots/Chargingspots
 */
const locationHandler = {

    /**
     *  @param {object} e
     *  @returns {Array}  Array of objects(Locations)
     * getLocations({city:"stockholm"})
     * @example
     * // returns all locations in stockholm
     */
    getLocations: (e) => {
        try {
        switch (e.location) {
            case 'stockholm':
                return stockholm
            case 'goteborg':
                return goteborg
            case 'malmo':
                return malmo
            default:
                return stockholm
        }
        } catch(error) {
            console.log(error)
        }
    },

    /**
     *  @param {object} e
     *  @returns {Array}  Array of objects(ChargingStations)
     *  getChargingStations({city:"stockholm"})
     *  @example
     *  // returns all charging stations in stockholm
     */
    getChargingStations: (e) => {
        try {
        switch (e.location) {
            case 'stockholm':
                return stockholm.filter((e) => { return e.charging == true })
            case 'goteborg':
                return goteborg.filter((e) => { return e.charging == true })
            case 'malmo':
                return malmo.filter((e) => { return e.charging == true })
            default:
                return stockholm.filter((e) => { return e.charging == true })
        }
        } catch(error) {
            console.log(error)
        }
    },

    /**
     * TODO
     * @param {*} e id
     */
    adjustLocations: (e) => {

    },

    /**
     * TODO
     * @param {*} e object
     */
    insertLocations: (e) => {

    }
}
module.exports = locationHandler;