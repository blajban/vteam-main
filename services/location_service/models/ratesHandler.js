/**
 *  ratesHandler
 *  rates
 */

class RatesHandler{

    constructor(){
        return this.#init();
    }

    async #init(){
        return this
    }

    /**
     *  @returns {Number}  Array of object(Rates)
     */
    async getRates (mongo) {
        try {
            const ratesCollection = await mongo.find("rates");
            return ratesCollection;
        } catch (error) {
            return error;
        }
    }

    /**
     * inserts a rate to the database.
     *
     * @async
     * @param {Object} e - The event object containing the location to insert.
     * @param {Object} e._id - _if of the object to be updated.
     * @param {Object} e.object - New data.
     * @returns {Object} - The result of the insert operation.
     */
    async adjustRate (mongo, e){
        if(!e._id) throw new Error("No _id provided");
        try {
            return await mongo.updateOne("rates",{_id: e._id}, e.object);
        } catch (error) {
            return error;
        }
        }

    /**
     * inserts a rate to the database.
     *
     * @async
     * @param {Object} e - The event object containing the location to insert.
     * @returns {Object} - The result of the insert operation.
     */
    async insertRate(mongo, e){
        try {
            return await mongo.insertOne("rates", e);
        } catch (error) {
            return error;
        }
    }

    /**
     * deletes a rate to the database.
     *
     * @async
     * @param {Object} e - The event object containing the location to insert.
     * @param {Object} e._id - _if of the object to be deleted.
     * @returns {Object} - The result of the insert operation.
     */
    async deleteRate(mongo, e) {
        if(!e._id) throw new Error("No _id provided");
        try {
            return await mongo.deleteOne("rates", {_id: e._id});
        } catch (error) {
            return error;
        }
    }
}
module.exports = RatesHandler;