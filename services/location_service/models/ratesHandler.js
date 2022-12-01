const rateDok = require("../../../shared/location_service/rates");

const ratesHandler = {
    getRates: (e) => {
        return rateDok[0][e]
    }
}
module.exports = ratesHandler;