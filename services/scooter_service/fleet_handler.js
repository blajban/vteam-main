
const { MongoWrapper } = require('../../shared/mongowrapper');

class FleetHandler {
  /**
   * Constructor
   * @returns {object}
   */
    constructor() {
      return this.#init();
    }

    /**
     * Initiate (used to get around constructor async limitations).
     * @returns {object}
     */
    async #init() {
      this.db = await new MongoWrapper("scooters");
      this.collectionName = "scooters";
      this.newScooters = [];
      return this;
    }

    /**
     * Get scooters from db. Use options to filter on _id or location.
     * @param {object} options 
     * @returns {Array}
     */
    async getScooters(options = {}) {
      const filter = {};

      if (options.hasOwnProperty('_id')) {
        filter._id = options._id;

        const scooter = this.db.findOne(this.collectionName, filter);
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
     * Add new scooter to db.
     * @param {object} newScooterInfo 
     * @returns {objec}
     */
    async addScooter(newScooterInfo) {
      const newScooter = {
        status: "available",
        userId: 0,
        properties: {
            location: newScooterInfo.location,
            lat: newScooterInfo.lat,
            lng: newScooterInfo.lng,
            speed: 0,
            battery: 100
        },
        log: []
      }

      await this.db.insertOne(this.collectionName, newScooter);

      return newScooter;
     
    }

    /**
     * Update scooters in db.
     * @param {Array} scooters 
     */
    async updateScooters(scooters) {
      let modifiedCount = 0;

      for (const scooter of scooters) {
        const obj = {
          _id: scooter._id
        };

        const scooterToUpdate = JSON.parse(JSON.stringify(scooter));

        delete scooterToUpdate._id;

        const modified = await this.db.updateOne(this.collectionName, obj, scooterToUpdate);
        if (modified.modifiedCount === 1) {
          modifiedCount++;
        }
      }

      console.log(`Modified ${modifiedCount} scooters`);
    }
  

    /**
     * Update scooter in db.
     * @param {object} updatedScooter 
     * @returns {object}
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
     * Remove scooter in db.
     * @param {object} id 
     * @returns {object}
     */
    async removeScooter(id) {

      const deletedScooter = await this.db.findOne(this.collectionName, id);

      await this.db.deleteOne(this.collectionName, id);

      return deletedScooter;
    }

}


module.exports = { FleetHandler };