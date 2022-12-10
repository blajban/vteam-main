


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
    getLocations: async (mongo, e) => {
        try {
        const locationsCollection = await mongo.find("locaions", e.location || "stockholm");
        return locationsCollection;
        } catch (error) {
        console.log(error);
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
        const result = await mongo.updateOne("locaions", e.location, e);
        return result

    } catch (error) {
        console.log(error);
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
    try {
        const result = await mongo.insertOne("locaions", e.location, e);
        return result

    } catch (error) {
        console.log(error);
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
    try {
        const result = await mongo.deleteOne("locaions", e.location, e);
        return result

    } catch (error) {
        console.log(error);
    }
    }
}
module.exports = locationHandler;