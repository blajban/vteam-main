const rateDok = require("../../../shared/location_service/rates");

/**
 *  ratesHandler
 *  rates
 */

const ratesHandler = {
    /**
     *  @param {object} e
     *  @returns {Number}  Array of object(Rates)
     * getRates({city:"a"})
     * @example
     * // returns rate for a
     *  getRates()
     * @example
     * // returns all rates
     */
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
    },
    /**
     * Todo
     * @param {*} e
     */
    adjustRate: (e) => {

    },
    /**
     * Todo
     * @param {*} e
     */
    insertRate: (e) => {

    }
}
module.exports = ratesHandler;