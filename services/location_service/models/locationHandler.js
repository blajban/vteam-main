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
        console.log(locationsCollection)
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
    * Adjust the locations of the charging stations.
    * @param {object} e
    * @param {string} e.
    * @param {Array} e.chargingStations - The new list of charging stations for the location.
    */
    adjustLocations: (e) => {
    try {
        const stationsCollection = db.collection("stations");
        stationsCollection.findOneAndUpdate(
        { location: e.location },
        { $set: { stations: e.chargingStations } },
        { returnOriginal: false }
    );
    } catch (error) {
        console.log(error);
    }
    },

    /**
    *Insert a new location and its charging stations.
    *@param {object} e
    *@param {string} e.location - The name of the new location.
    *@param {Array} e.chargingStations - The list of charging stations for the new location.
    */
insertLocations: (e) => {
    try {
    // Insert the new location into the "locations" collection.
        const locationsCollection = db.collection("locations");
        locationsCollection.insertOne({ name: e.location });

        // Insert the new charging stations into the "stations" collection.
        const stationsCollection = db.collection("stations");
        stationsCollection.insertOne({ location: e.location, stations: e.chargingStations });
    } catch (error) {
        console.log(error);
    }
    }
}
module.exports = locationHandler;