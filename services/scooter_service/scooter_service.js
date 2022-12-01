
const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes, exchanges } = require('../../shared/resources');

const scooters = require('../../shared/dummy_data/scooter_service/scooters');


/**
 * Main function to set up event flow. Listens for events and sends events with the correct data.
 */
const scooterService = async () => {

  // Init
  const systemBroker = await new MessageBroker(host, exchanges.system, 'scooter_service');
  const scooterBroker = await new MessageBroker(host, exchanges.scooters, 'scooter_service');
  const scooterManager = new ScooterManager();

  // Unlocking scooter
  systemBroker.onEvent(eventTypes.rentScooterEvents.rentScooter, (e) => {
    const data = scooterManager.unlockScooter(5);
    const newEvent = scooterBroker.constructEvent(eventTypes.rentScooterEvents.unlockScooter, data);
    scooterBroker.publish(newEvent);
  });

  scooterBroker.onEvent(eventTypes.rentScooterEvents.scooterUnlocked, (e) => {
    const newEvent = systemBroker.constructEvent(eventTypes.rentScooterEvents.rideStarted, data);
    systemBroker.publish(newEvent);
  });

  // Scooters reporting
  scooterBroker.onEvent(eventTypes.scooterEvents.scooterIdleReporting, (e) => {
    scooterManager.updateScooterPosition(1, { long: "4343", lat: "3232"});
    console.log("Scooter reported!");
  })

  scooterBroker.onEvent(eventTypes.scooterEvents.scooterMoving, (e) => {
    console.log("Got report from a moving scooter");
  })

  scooterBroker.onEvent(eventTypes.scooterEvents.batteryLow, (e) => {
    console.log("Scooter reported low battery!");
  })

  // Locking scooter
  systemBroker.onEvent(eventTypes.returnScooterEvents.parkScooter, (e) => {
    const newEvent = scooterBroker.constructEvent(eventTypes.returnScooterEvents.lockScooter, data);
    scooterBroker.publish(newEvent);
  });

  scooterBroker.onEvent(eventTypes.returnScooterEvents.scooterLocked, (e) => {
    const newEvent = systemBroker.constructEvent(eventTypes.returnScooterEvents.rideFinished, data);
    systemBroker.publish(newEvent);
  });

  // Admin events
  systemBroker.onEvent(eventTypes.adminEvents.moveScooter, (e) => {
    console.log("Admin decided to move a scooter!");
  });

  // RPC
  systemBroker.response(eventTypes.rpcEvents.getScooters, (e) => {
    // dummy data
    return scooters;
  });

  scooterBroker.response("registerScooter", (e) => {
    return scooterManager.registerScooter();
  });

}

/**
 * Flöde:
 * 
 * 1. Scooter startar
 * 2. Registrerar sig och får sin information via rpc
 * 3. 
 */


// Todo: add fleet manager to handle scooter data. Dummy data for now

class ScooterManager {
  constructor() {
      console.log("Scooter manager initialized!");
      this.inactiveScooters = scooters;
      this.activeScooters = [];
  }

  registerScooter() {
    const activatedScooter = this.inactiveScooters.shift();
    this.activeScooters.push(activatedScooter);
    return this.activeScooters[id];
  }
  
  unlockScooter(scooterId, userId) {
    for (const scooter of this.activeScooters) {
      if (scooter.scooterId === scooterId) {
        scooter.status = "claimed";
        scooter.userId = userId;
        return scooter;
      }
    }
  }

  updateScooterPosition(scooterId, position) {
    for (const scooter of this.activeScooters) {
      if (scooter.scooterId === scooterId) {
        scooter.properties.lat = position.lat;
        scooter.properties.long = position.long;
        return true;
      }
    }
    return false;
  }
}


scooterService();

module.exports = { ScooterManager };