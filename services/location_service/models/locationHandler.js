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
        }
        } catch(error) {
            console.log(error)
        }
    }
}
module.exports = locationHandler;