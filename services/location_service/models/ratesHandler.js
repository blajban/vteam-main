const rateDok = require("../../../shared/location_service/rates");

const ratesHandler = {
    getRates: (e) => {
        try {
            switch (e) {
                case 'a':
                    return rateDok[0][e]
                case 'b':
                    return rateDok[0][e]
                case 'c':
                    return rateDok[0][e]
                case 'd':
                    return rateDok[0][e]
                default:
                    return rateDok[0]
            }
            } catch(error) {
                console.log(error)
            }
        return rateDok[0][e]
    }
}
module.exports = ratesHandler;