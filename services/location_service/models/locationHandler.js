const stockholm = require("../../../shared/location_service/stockholmLocations.json");
const goteborg = require("../../../shared/location_service/goteborgLocations.json");
const malmo = require("../../../shared/location_service/malmoLocations.json");
const database = require("../database/database")

const { MongoDBWrapper } = require('../../../shared/mongowrapper');



/**
     * An object containing the locations.
     * @property {object} stockholm - The Stockholm location.
     * @property {object} goteborg - The Goteborg location.
     * @property {object} malmo - The Malmo location.
     */
const locations = {
    stockholm: stockholm,
    goteborg: goteborg,
    malmo: malmo
};

/**
 *  locationHandler
 *  Handles
 *  Parkingspots/Chargingspots
 */
const locationHandler = {

    chargingStations: new Map([
        ["stockholm", stockholm.filter((station) => station.charging)],
        ["goteborg", goteborg.filter((station) => station.charging)],
        ["malmo", malmo.filter((station) => station.charging)],
      ]),

    /**
     * Returns the location with the specified name.
     * @param {object} e - The event object.
     * @param {string} e.location - The name of the location.
     * @returns {object} The location object.
     */
    getLocations: async (e) => {
        const mongoDbwrapper = new MongoDBWrapper(await database.getDb())
        try {
        const locationsCollection = await mongoDbwrapper.find("locaions", e.location || "stockholm");
        return locationsCollection;
        } catch (error) {
        console.log(error);
        }
    },

    /**
   * Returns the charging stations for the specified location.
   * @param {object} e - The event object.
   * @param {string} e.location - The name of the location.
   * @returns {Array} An array of charging station objects.
   * @example
   * getChargingStations({ location: "stockholm" });
   * // Returns all charging stations in Stockholm.
    */
    getChargingStations: (e) => {
        try {
          // Get the charging stations for the specified location.
          const locationCollection = this.getLocations(e)

          // Filter the charging stations by the "charging" property.
          return locationCollection.filter((parking) => parking.charging);
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
    adjustLocation: async (e) => {
        const mongoDbwrapper = new MongoDBWrapper(await database.getDb())
    try {
        const result = await mongoDbwrapper.updateOne("locaions", e.location, e);
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
    insertLocation: async (e) => {
        const mongoDbwrapper = new MongoDBWrapper(await database.getDb())
    try {
        const result = await mongoDbwrapper.insertOne("locaions", e.location, e);
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
    deleteLocation: async (e) => {
        const mongoDbwrapper = new MongoDBWrapper(await database.getDb())
    try {
        const result = await mongoDbwrapper.deleteOne("locaions", e.location, e);
        return result

    } catch (error) {
        console.log(error);
    }
    }
}
module.exports = locationHandler;