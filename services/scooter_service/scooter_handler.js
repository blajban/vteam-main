const { MongoWrapper } = require('../../shared/mongowrapper');
const scooters = require('../../../shared/dummy_data/scooter_service/scooters');



// TODO
// - db
// - ändra till _id
// 

class ScooterHandler {
    constructor() {
      return this.#init();
    }

    async #init() {
      this.db = await new MongoWrapper("scooters");
      this.collectionName = "scooters";
      return this;
    }

    async getScooters(options = {}) {
      const filter = {};

      if (options.hasOwnProperty('_id')) {
        filter._id = options._id;

        const scooter = this.db.findOne(this.collectionName, filter);
        if (scooter === null) {
          return [];
        }
      }

      if (options.hasOwnProperty('location')) {
        filter['properties.location'] = options.location;
      }

      return await this.db.find(this.collectionName, filter);

    }
  
    async addScooter(newScooterInfo) {
      const newScooter = {
        status: "inactive",
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
  

    async updateScooter(updatedScooter) {
      const id = {};
      const filter = {};

      if (updatedScooter.hasOwnProperty('_id')) {
        id._id = updatedScooter._id;
      }

      console.log(id._id);

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
  
    async removeScooter(id) {

      const deletedScooter = await this.db.findOne(this.collectionName, id);

      await this.db.deleteOne(this.collectionName, id);

      return deletedScooter;
    }
    

    /**
     * Unlock scooter: change info and return scooter data.
     * @param {number} scooterId 
     * @param {number} userId 
     * @returns {object}
     */

    unlockScooter(scooterId, userId) {
      for (const scooter of this.scooters) {
        if (scooter.scooterId === scooterId) {
          scooter.status = "claimed";
          scooter.userId = userId;
          return scooter;
        }
      }
    }

    /**
     * Scooter unlocked: change info and return scooter data.
     * @param {object} unlockedScooter 
     * @returns {object}
     */

    scooterUnlocked(unlockedScooter) {
      for (const scooter of this.scooters) {
        if (scooter.scooterId === unlockedScooter.scooterId) {
          scooter.status = unlockedScooter.status;
          scooter.userId = unlockedScooter.userId;
          console.log(`Scooter ${scooter.scooterId} unlocked`)
          return scooter;
        }
      }
    }

    /**
     * Lock scooter. Change info and return scooter data.
     * @param {number} scooterId 
     * @returns {object}
     */

    lockScooter(scooterId) {
      for (const scooter of this.scooters) {
        if (scooter.scooterId === scooterId) {
          scooter.status = "available";
          scooter.userId = 0;
          return scooter;
        }
      }
    }

  
    /**
     * Scooter locked. Change info and return locked scooter.
     * @param {object} lockedScooter 
     * @returns 
     */

    scooterLocked(lockedScooter) {
      for (const scooter of this.scooters) {
        if (scooter.scooterId === lockedScooter.scooterId) {
          scooter.status = lockedScooter.status;
          scooter.userId = lockedScooter.userId;
          console.log(`Scooter ${scooter.scooterId} locked`)
          return scooter;
        }
      }
    }

    /**
     * Update scooter position info
     * @param {number} scooterId 
     * @param {object} position 
     * @returns {boolean}
     */
    updateScooterPosition(scooterId, position) {
      for (const scooter of this.scooters) {
        if (scooter.scooterId === scooterId) {
          scooter.properties.lat = position.lat;
          scooter.properties.lng = position.lng;
          console.log(`Scooter ${scooter.scooterId} at lat: ${scooter.properties.lat} lng: ${scooter.properties.lng}.`)
          return true;
        }
      }
      return false;
    }
}


module.exports = { ScooterHandler };