const { MongoWrapper } = require('../../../shared/mongowrapper');
const scooters = require('../../../shared/dummy_data/scooter_service/scooters');




class ScooterHandler {
    constructor() {
      return this.#init();
    }

    async #init() {
      this.db = await new MongoWrapper("scoooooooooters");
      return this;
    }

    async test() {
      const newScooter = {
        scooterId: await this.db.getNextId("scoooooooooters", "scooterId"),
        status: "inactive",
        userId: 0,
        properties: {
            location: "goteborg",
            lat: 43.43434,
            lng: 65.655656,
            speed: 0,
            battery: 100
        },
        log: []
      }

      const insertedObj = await this.db.insertOne("scoooooooooters", newScooter);

      console.log(await this.db.find("scoooooooooters"));

    }
  
    // TODO: db/options
    getScooters(options = {}) {
      let result = this.scooters;
  
      
      if (options.hasOwnProperty('location')) {
        result = result.filter((scooter) => {
          return scooter.properties.location === options.location;
        });
      }
  
      
  
      if (options.hasOwnProperty('scooterId')) {
        result = result.filter((scooter) => {
          return scooter.scooterId === options.scooterId;
        });
      }
  
      return result;
    }
  
    addScooter(newScooterInfo) {
      const newScooter = {
        scooterId: 500,
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
  
      this.scooters.push(newScooter);
  
      return newScooter;
    }
  
    // TODO
    updateScooter(updatedScooter) {
      for (const scooter of this.scooters) {
        if (scooter.scooterId === updatedScooter.scooterId) {
  
          if (updatedScooter.hasOwnProperty('status')) {
            scooter.status = updatedScooter.status;
          }
          if (updatedScooter.hasOwnProperty('location')) {
              scooter.properties.location = updatedScooter.location;
          }
          if (updatedScooter.hasOwnProperty('lat')) {
              scooter.properties.lat = updatedScooter.lat;
          }
          if (updatedScooter.hasOwnProperty('lng')) {
              scooter.properties.lng = updatedScooter.lng;
          }
  
          return scooter;
        }
      }
      
    }
  
    removeScooter(scooterId) {
      for (let i = 0; i < this.scooters.length; i++) {
        if (this.scooters[i].scooterId === scooterId) {
          const removedScooter = this.scooters.splice(i, 1)[0];
          return removedScooter;
        }
      }
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
  
  const test = async () => {
    const sh = await new ScooterHandler();

    await sh.test();
  }

  test();

  
  //module.exports = { ScooterHandler };