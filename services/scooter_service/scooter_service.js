
const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes, exchanges } = require('../../shared/resources');

const scooters = require('../../shared/dummy_data/scooter_service/scooters');


/**
 * Main function to set up event flow. Listens for events and sends events with the correct data.
 */
const scooterService = async () => {

  const systemBroker = await new MessageBroker(host, exchanges.system, 'scooter_service');
  const scooterBroker = await new MessageBroker(host, exchanges.scooters, 'scooter_service');
  const scooterManager = new ScooterManager();

  /**
   * Unlock scooter
   */
  systemBroker.onEvent(eventTypes.rentScooterEvents.rentScooter, (e) => {
    // TODO: Get scooterId and userId from event
    const newEvent = scooterBroker.constructEvent(eventTypes.rentScooterEvents.unlockScooter, scooterManager.unlockScooter(5, 52));
    scooterBroker.publish(newEvent);
  });

  /**
   * Scooter unlocked
   */
  scooterBroker.onEvent(eventTypes.rentScooterEvents.scooterUnlocked, (e) => {
    const newEvent = systemBroker.constructEvent(eventTypes.rentScooterEvents.rideStarted, scooterManager.scooterUnlocked(e.data));
    systemBroker.publish(newEvent);
  });

  /**
   * Idle reporting
   */
  scooterBroker.onEvent(eventTypes.scooterEvents.scooterIdleReporting, (e) => {
    scooterManager.updateScooterPosition(e.data.scooterId, { long: e.data.properties.long, lat: e.data.properties.lat});
  })

  /**
   * Reporting while moving
   */
  scooterBroker.onEvent(eventTypes.scooterEvents.scooterMoving, (e) => {
    scooterManager.updateScooterPosition(e.data.scooterId, { long: e.data.properties.long, lat: e.data.properties.lat});
  })

  // TODO
  scooterBroker.onEvent(eventTypes.scooterEvents.batteryLow, (e) => {
    console.log("Scooter reported low battery!");
  })

  /**
   * Park scooter
   */
  systemBroker.onEvent(eventTypes.returnScooterEvents.parkScooter, (e) => {
    // TODO: Get scooterId from event
    const newEvent = scooterBroker.constructEvent(eventTypes.returnScooterEvents.lockScooter, scooterManager.lockScooter(5));
    scooterBroker.publish(newEvent);
  });

  /**
   * Scooter locked
   */
  scooterBroker.onEvent(eventTypes.returnScooterEvents.scooterLocked, (e) => {
    const newEvent = systemBroker.constructEvent(eventTypes.returnScooterEvents.rideFinished, scooterManager.scooterLocked(e.data));
    systemBroker.publish(newEvent);
  });

  // TODO
  systemBroker.onEvent(eventTypes.adminEvents.moveScooter, (e) => {
    console.log("Admin decided to move a scooter!");
  });

  /**
   * Get scooters, options in event.
   */
  systemBroker.response(eventTypes.rpcEvents.getScooters, (e) => {
    return scooterManager.getScooters(e.data);
  });

  // TODO: admin registering/adding scooter?
  scooterBroker.response("registerScooter", (e) => {
    return scooterManager.registerScooter();
  });

}

// TODO: add db

class ScooterManager {
  constructor() {
    console.log("Scooter manager initialized!");
    this.scooters = scooters;
  }

  // TODO: db/options
  getScooters(options) {
    return this.scooters;
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
        scooter.properties.long = position.long;
        console.log(`Scooter ${scooter.scooterId} at lat: ${scooter.properties.lat} long: ${scooter.properties.long}.`)
        return true;
      }
    }
    return false;
  }
}


scooterService();

module.exports = { ScooterManager };