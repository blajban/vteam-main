/**
 * @class ScooterHandler
 * Class for handling active scooters
 */
class ScooterHandler {
  /**
   * @constructor
   * @param {object[]} scooters - Array of scooters
   */
  constructor(scooters) {
    this.scooters = [];
    for (const scooter of scooters) {
      scooter._id = scooter._id.toString();
      this.scooters.push(scooter);
    }
  }

  /**
   * Adds a new active scooter
   * @param {object} newScooter - The new scooter
   */
  addActiveScooter(newScooter) {
    this.scooters.push(newScooter);
  }

  /**
   * Returns all active scooters
   * @return {object[]} The active scooters
   */
  activeScooters() {
    return this.scooters;
  }

  /**
   * Updates an active scooter
   * @param {object} scooterToUpdate - The updated scooter
   * @return {object} The updated scooter
   * @throws {Error} If the scooter with the ID is not found
   */
  updateActiveScooter(scooterToUpdate) {
    for (let i = 0; i < this.scooters.length; i++) {
      if (this.scooters[i]._id === scooterToUpdate._id) {
        this.scooters[i] = scooterToUpdate;
        return true;
      }
    }

    throw new Error(`Scooter with ID ${scooterToUpdate._id} not found`);
  }

  /**
   * Removes an active scooter from the list
   * @param {object} scooterToDelete - The scooter to delete
   * @throws {Error} If the scooter with the ID is not found
   */
  removeActiveScooter(scooterToDelete) {
    for (let i = 0; i < this.scooters.length; i++) {
      if (this.scooters[i]._id === scooterToDelete._id) {
        this.scooters.splice(i, 1);
        return true;
      }
    }

    throw new Error(`Scooter with ID ${scooterToDelete._id} not found`);
  }

  /**
   * Unlocks a scooter and updates status to "claimed"
   * @param {string} scooterId - The ID of the scooter unlock
   * @param {string} userId - The ID of the user who is unlocking the scooter
   * @return {object} The updated scooter
   * @throws {Error} If the scooter with the ID is not found
   */
  unlockScooter(scooterId, userId) {
    for (const scooter of this.scooters) {
      if (scooter._id === scooterId) {
        scooter.status = "claimed";
        scooter.userId = userId;
        return scooter;
      }
    }

    throw new Error(`Scooter with ID ${scooterId} not found`);
  }

  /**
   * Updates the status and user ID of an unlocked scooter
   * @param {object} unlockedScooter - The scooter with updated status and user ID
   * @return {object} The updated scooter
   * @throws {Error} If the scooter with the ID is not found
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

    throw new Error(`Scooter with ID ${unlockedScooter._id} not found`);
  }

  /**
   * Locks a scooter and updates its status to "available"
   * @param {string} scooterId - The ID of the scooter to be locked
   * @return {object} The updated scooter
   * @throws {Error} If the scooter with the ID is not found
   */
  lockScooter(scooterId) {
    for (const scooter of this.scooters) {
      if (scooter._id === scooterId) {
        scooter.status = "available";
        scooter.userId = 0;
        return scooter;
      }
    }

    throw new Error(`Scooter with ID ${scooterId} not found`);
  }

  /**
   * Updates the status and user ID of a locked scooter
   * @param {object} lockedScooter - The scooter with updated status and user ID
   * @return {Object} The updated scooter
   * @throws {Error} If the scooter with the ID is not found
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

    throw new Error(`Scooter with ID ${lockedScooter._id} not found`);
  }

  /**
   * Updates the position of a scooter
   * @param {object} reportingScooter - The scooter with updated position
   * @throws {Error} If the scooter with the ID is not found
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
    
    throw new Error(`Scooter with ID ${reportingScooter._id} not found`);
  }
}


module.exports = { ScooterHandler };