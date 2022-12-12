/**
 *  ratesHandler
 *  rates
 */

const ratesHandler = {
    /**
     *  @param {object} e
     *  @returns {Number}  Array of object(Rates)
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
        try {
            // Copy of object because cant update a object with _id
            let objectWithoutId = JSON.parse(JSON.stringify(e));
            // Remove _id from object to be updated
            delete objectWithoutId._id
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
        try {
            return await mongo.deleteOne("rates", e);
        } catch (error) {
            console.log(error);
        }
    },
}
module.exports = ratesHandler;