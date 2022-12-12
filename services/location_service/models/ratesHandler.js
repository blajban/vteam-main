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
        const ratesCollection = await mongo.find("rates");
        return ratesCollection;
        } catch (error) {
        console.log(error);
        }
    },
    //Done
    getRate: async (mongo, e) => {
        try {
        const ratesCollection = await mongo.findOne("rates", e.rate, {"id": "a"});
        return ratesCollection;
        } catch (error) {
        console.log(error);
        }
    },
    /**
     * Done
     * @param {*} e
     */
    adjustRate: async (mongo, e) => {
        console.log(e)
        try {
            // Copy of object because cant update a object with _id
            let objectWithoutId = JSON.parse(JSON.stringify(e));
            // Remove _id from object to be updated
            delete objectWithoutId._id
            console.log(e._id)
            return await mongo.updateOne("rates",{_id:e._id}, objectWithoutId);
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
            return await mongo.insertOne("rates", e);
        } catch (error) {
            console.log(error);
        }
    },
    /**
     * Todo
     * @param {*} e
     */
    deleteRate: async (mongo, e) => {
        console.log(e)
        try {
            const result = await mongo.deleteOne("rates", e);
            console.log(result)
        return result;
        } catch (error) {
            console.log(error);
        }
    },
}
module.exports = ratesHandler;