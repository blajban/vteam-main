/**
 * Class to handle the scooter fleet.
 */
class FleetHandler {
  /**
   * Creates a new FleetHandler instance and initializes the db connection.
   * @param {object} - A MongoWrapper object.
   */
  constructor(mongoWrapper) {
    this.db = mongoWrapper;
    this.collectionName = 'scooters';
  }

  /**
   * Get scooters from the db based on the options.
   * @param {object} [options={}]
   * @param {string} [options._id] - filter on ID.
   * @param {string} [options.location] - filter on location.
   * @returns {Promise<Array>} Array of scooters.
   */
  async getScooters(options = {}) {
    const filter = {};

    if (options.hasOwnProperty('_id')) {
      filter._id = options._id;

      const scooter = await this.db.findOne(this.collectionName, filter);
      if (scooter === null) {
        return [];
      }

      return scooter;
    }

    if (options.hasOwnProperty('location')) {
      filter['properties.location'] = options.location;
    }

    return await this.db.find(this.collectionName, filter);
  }

  /**
   * Adds a new scooter to db.
   * @param {object} newScooterInfo - The information for the new scooter.
   * @param {string} newScooterInfo.location - The location of the new scooter.
   * @param {number} newScooterInfo.lat - The latitude of the new scooter.
   * @param {number} newScooterInfo.lng - The longitude of the new scooter.
   * @returns {Promise<object>}
   */
  async addScooter(newScooterInfo) {
    const newScooter = {
      status: 'available',
      userId: 0,
      properties: {
        location: newScooterInfo.location,
        lat: newScooterInfo.lat,
        lng: newScooterInfo.lng,
        speed: 0,
        battery: 100,
      },
      log: [],
    };

    await this.db.insertOne(this.collectionName, newScooter);

    return newScooter;
  }

  /**
   * Updates the scooters in db.
   * @param {Array} scooters - The array of scooters to update.
   * @returns {Promise<void>}
   */
  async updateScooters(scooters) {
    let modifiedCount = 0;

    for (const scooter of scooters) {
      const obj = {
        _id: scooter._id,
      };

      const scooterToUpdate = JSON.parse(JSON.stringify(scooter));

      delete scooterToUpdate._id;

      const modified = await this.db.updateOne(this.collectionName, obj, scooterToUpdate);
      if (modified.modifiedCount === 1) {
        modifiedCount += 1;
      }
    }

    console.log(`Modified ${modifiedCount} scooters`);
  }

  /**
   * Updates a scooter in the database with the provided information.
   * @param {object} updatedScooter - The updated scooter information.
   * @param {string} [updatedScooter._id] - The ID of the scooter to update.
   * @param {string} [updatedScooter.status] - The new status of the scooter.
   * @param {string} [updatedScooter.location] - The new location of the scooter.
   * @param {number} [updatedScooter.lat] - The new latitude of the scooter.
   * @param {number} [updatedScooter.lng] - The new longitude of the scooter.
   * @returns {Promise<object>} The updated scooter object.
   */
  async updateScooter(updatedScooter) {
    const id = {};
    const filter = {};

    if (updatedScooter.hasOwnProperty('_id')) {
      id._id = updatedScooter._id;
    }

    if (updatedScooter.hasOwnProperty('status')) {
      filter.status = updatedScooter.status;
    }

    if (updatedScooter.hasOwnProperty('location')) {
      filter['properties.location'] = updatedScooter.location;
    }

    if (updatedScooter.hasOwnProperty('lat')) {
      filter['properties.lat'] = updatedScooter.lat;
    }

    if (updatedScooter.hasOwnProperty('lng')) {
      filter['properties.lng'] = updatedScooter.lng;
    }

    await this.db.updateOne(this.collectionName, id, filter);

    return await this.db.findOne(this.collectionName, filter);
  }

  /**
   * Removes a scooter from the db.
   * @param {object} id - The ID of the scooter to remove.
   * @returns {Promise<object>} The removed scooter object.
   */
  async removeScooter(id) {
    const deletedScooter = await this.db.findOne(this.collectionName, id);
    await this.db.deleteOne(this.collectionName, id);
    return deletedScooter;
  }
}

module.exports = { FleetHandler };
