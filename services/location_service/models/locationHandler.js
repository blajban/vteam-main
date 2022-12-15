


/**
 *  locationHandler
 *  Handles
 *  Parkingspots/Chargingspots
 */
const locationHandler = {


    /**
     * Returns the location with the specified name.
     * @param {object} e - The event object.
     * @param {string} e.location - The name of the location.
     * @returns {object} The location object.
     */
    getLocations: (mongo, e) => {
        try {
            return mongo.find(e.location);
        } catch (error) {
            return error;
        }
    },

    /**
     * adjust a location from the database.
     *
     * @async
     * @param {Object} e - The event object containing the location to adjust.
     * @param {string} e.location - Name of collection.
     * @returns {Object} - The result of the adjust operation.
     */
    adjustLocation: async (mongo, e) => {
    try {
        // Copy of object because cant update a object with _id
        let objectWithoutId = JSON.parse(JSON.stringify(e.object));
        objectWithoutId = JSON.parse(objectWithoutId)
        let _id = objectWithoutId._id
        // Remove _id from object to be updated
        delete objectWithoutId._id
        return await mongo.updateOne(e.location, {_id:_id}, objectWithoutId);
    } catch (error) {
        return error;
    }
    },

    /**
     * inserts a location from the database.
     *
     * @async
     * @param {Object} e - The event object containing the location to insert.
     * @param {string} e.location - Name of collection.
     * @returns {Object} - The result of the insert operation.
     */
    insertLocation: async (mongo, e) => {
        console.log(e)
    try {
        let f = await mongo.insertOne(e.location, e.object);
        console.log(f)
        return f;

    } catch (error) {
        console.log(error)
        return error;
    }
    },
    /**
     * Deletes a location from the database.
     *
     * @async
     * @param {Object} e - The event object containing the location to delete.
     * @param {string} e.location - Name of collection.
     * @returns {Object} - The result of the delete operation.
     */
    deleteLocation: async (mongo, e) => {
        console.log("hej")
    try {
        let result = await mongo.deleteOne(e.location, e.object);
        console.log("hej")
        console.log(result)
        return result
    } catch (error) {
        console.log(error)
        return error;
    }
    }
}
module.exports = locationHandler;