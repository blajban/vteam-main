/**
 *  locationHandler
 *  Handles
 *  Parkingspots/Chargingspots
 */
class LocationHandler {
  constructor() {
    this.#init();
  }

  async #init() {
    return this;
  }

  /**
   * Returns the locations.
   * @param {object} e - The event object.
   * @param {string} e.location - The name of the location.
   * @returns {object} The locations object.
   */
  getLocations(mongo, e) {
    try {
      return mongo.find(e.location);
    } catch (error) {
      return error;
    }
  }

  /**
   * adjust a location in the database.
   *
   * @async
   * @param {Object} e - The event object containing the location to adjust.
   * @param {string} e.location - Name of collection.
   * @returns {Object} - The result of the adjust operation.
   */
  async adjustLocation(mongo, e) {
    if (!e.object._id) throw new Error('No _id provided');
    try {
      const _id = e.object._id;
      delete e.object._id;
      const f = await mongo.updateOne(e.location, { _id: _id }, e.object);
      return f;
    } catch (error) {
      return error;
    }
  }

  /**
   * inserts a location to the database.
   *
   * @async
   * @param {Object} e - The event object containing the location to insert.
   * @param {string} e.location - Name of collection.
   * @returns {Object} - The result of the insert operation.
   */
  async insertLocation(mongo, e) {
    try {
      const f = await mongo.insertOne(e.location, e.object);
      return f;
    } catch (error) {
      return error;
    }
  }

  /**
   * Deletes a location from the database.
   *
   * @async
   * @param {Object} e - The event object containing the location to delete.
   * @param {string} e.location - Name of collection.
   * @returns {Object} - The result of the delete operation.
   */
  async deleteLocation(mongo, e) {
    try {
      const result = await mongo.deleteOne(e.location, e.object);
      return result;
    } catch (error) {
      return error;
    }
  }
}
module.exports = LocationHandler;
