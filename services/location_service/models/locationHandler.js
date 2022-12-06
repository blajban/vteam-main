const stockholm = require("../../../shared/location_service/stockholmLocations.json");
const goteborg = require("../../../shared/location_service/goteborgLocations.json");
const malmo = require("../../../shared/location_service/malmoLocations.json");

const locationHandler = {
    getLocations: (e) => {
        try {
        switch (e.city) {
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
    getChargingStations: (e) => {
        try {
        switch (e.city) {
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
    }
}
module.exports = locationHandler;