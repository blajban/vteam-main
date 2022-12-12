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
    getRates: async (mongo, e) => {
        try {
        const ratesCollection = await mongo.find("rates", e.rate);
        return ratesCollection;
        } catch (error) {
        console.log(error);
        }
    },

    getRate: async (mongo, e) => {
        try {
        const ratesCollection = await mongo.findOne("rates", e.rate, {"tariff": 1});
        return ratesCollection;
        } catch (error) {
        console.log(error);
        }
    },
    /**
     * Todo
     * @param {*} e
     */
    adjustRate: async (mongo, e) => {
        try {
        const ratesCollection = await mongo.updateOne("rates", e.rate);
        return ratesCollection;
        } catch (error) {
        console.log(error);
        }
    },
    /**
     * Todo
     * @param {*} e
     */
    insertRate: async (mongo, e) => {
        try {
        const ratesCollection = await mongo.insertOne("rates", e.rate);
        return ratesCollection;
        } catch (error) {
        console.log(error);
        }
    },
    /**
     * Todo
     * @param {*} e
     */
    deleteRate: async (mongo, e) => {
        try {
        const ratesCollection = await mongo.deleteOne("rates", e.rate);
        return ratesCollection;
        } catch (error) {
        console.log(error);
        }
    },
}
module.exports = ratesHandler;