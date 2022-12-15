
class ScooterHandler {
    constructor(scooters) {
      this.scooters = [];
      for (const scooter of scooters) {
        scooter._id = scooter._id.toString();
        this.scooters.push(scooter);
      }
    }

    /**
     * Add scooter to active scooters.
     * @param {object} newScooter 
     */
    addActiveScooter(newScooter) {
      this.scooters.push(newScooter);
    }

    /**
     * Returns array of active scooters.
     * @returns {Array}
     */
    activeScooters() {
      return this.scooters;
    }

    /**
     * Update active scooter
     * @param {object} scooterToUpdate 
     */
    updateActiveScooter(scooterToUpdate) {
      for (let scooter of this.scooters) {
        if (scooter._id === scooterToUpdate._id) {
          scooter = scooterToUpdate;
        }
      }
    }

    /**
     * Remove active scooter
     * @param {object} scooterToDelete 
     */
    removeActiveScooter(scooterToDelete) {
      for (let i = 0; i < this.scooters.length; i++) {
        if (this.scooters[i]._id === scooterToDelete._id) {
          this.scooters.splice(i, 1);
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
        if (scooter._id === scooterId) {
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
        if (scooter._id === unlockedScooter._id) {
          scooter.status = unlockedScooter.status;
          scooter.userId = unlockedScooter.userId;
          console.log(`Scooter ${scooter._id} unlocked`)
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
        if (scooter._id === scooterId) {
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
        if (scooter._id === lockedScooter._id) {
          scooter.status = lockedScooter.status;
          scooter.userId = lockedScooter.userId;
          console.log(`Scooter ${scooter._id} locked`)
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
    updateScooterPosition(reportingScooter) {
      for (const scooter of this.scooters) {
        if (scooter._id === reportingScooter._id) {
          scooter.properties.lat = reportingScooter.properties.lat;
          scooter.properties.lng = reportingScooter.properties.lng;
          console.log(`Scooter ${scooter._id} at lat: ${scooter.properties.lat} lng: ${scooter.properties.lng}.`)
          return true;
        }
      }
      return false;
    }
}


module.exports = { ScooterHandler };