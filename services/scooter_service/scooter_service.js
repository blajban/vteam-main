
const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes } = require('../../shared/resources');

const scooters = require('../../shared/dummy_data/scooter_service/scooters');

const { ScooterHandler } = require('./scooter_handler');

// TODO: add scooter added event and update simulation

/**
 * Main function to set up event flow. Listens for events and sends events with the correct data.
 */
const scooterService = async () => {

  const broker = await new MessageBroker(host, 'scooter_service');
  const scooterManager = await new ScooterHandler();

  /**
   * Simulate all scooters
   */
   broker.onEvent(eventTypes.adminEvents.simulateScooters, (e) => {
    for (const scooter of scooterManager.getScooters()) {
      const data = scooterManager.unlockScooter(scooter.scooterId, 1000);
      data.simulate = true;
      const newEvent = broker.constructEvent(eventTypes.rentScooterEvents.unlockScooter, data);
      broker.publish(newEvent);
    }
  });

  /**
   * Stop simulation
   */
   broker.onEvent(eventTypes.adminEvents.stopSimulation, (e) => {
    console.log("stopping")
    for (const scooter of scooterManager.getScooters()) {
      const newEvent = broker.constructEvent(eventTypes.returnScooterEvents.lockScooter, scooterManager.lockScooter(scooter.scooterId));
      broker.publish(newEvent);
    }
  })

  /**
   * Unlock scooter
   */
   broker.onEvent(eventTypes.rentScooterEvents.rentScooter, (e) => {
    // TODO: Get scooterId and userId from event
    const newEvent = broker.constructEvent(eventTypes.rentScooterEvents.unlockScooter, scooterManager.unlockScooter(5, 52));
    broker.publish(newEvent);
  });

  /**
   * Scooter unlocked
   */
   broker.onEvent(eventTypes.rentScooterEvents.scooterUnlocked, (e) => {
    const newEvent = broker.constructEvent(eventTypes.rentScooterEvents.rideStarted, scooterManager.scooterUnlocked(e.data));
    broker.publish(newEvent);
  });

  /**
   * Idle reporting
   */
   broker.onEvent(eventTypes.scooterEvents.scooterIdleReporting, (e) => {
    scooterManager.updateScooterPosition(e.data.scooterId, { lng: e.data.properties.lng, lat: e.data.properties.lat});
  })

  /**
   * Reporting while moving
   */
   broker.onEvent(eventTypes.scooterEvents.scooterMoving, (e) => {
    scooterManager.updateScooterPosition(e.data.scooterId, { lng: e.data.properties.lng, lat: e.data.properties.lat});
  })

  // TODO
  broker.onEvent(eventTypes.scooterEvents.batteryLow, (e) => {
    console.log("Scooter reported low battery!");
  })

  /**
   * Park scooter
   */
   broker.onEvent(eventTypes.returnScooterEvents.parkScooter, (e) => {
    // TODO: Get scooterId from event
    const newEvent = broker.constructEvent(eventTypes.returnScooterEvents.lockScooter, scooterManager.lockScooter(5));
    broker.publish(newEvent);
  });

  /**
   * Scooter locked
   */
   broker.onEvent(eventTypes.returnScooterEvents.scooterLocked, (e) => {
    const newEvent = broker.constructEvent(eventTypes.returnScooterEvents.rideFinished, scooterManager.scooterLocked(e.data));
    broker.publish(newEvent);
  });

  // TODO
  broker.onEvent(eventTypes.adminEvents.moveScooter, (e) => {
    console.log("Admin decided to move a scooter!");
  });

  /**
   * Get scooters, options in event.
   */
   broker.response(eventTypes.rpcEvents.getScooters, async (e) => {
    return await scooterManager.getScooters(e.data);
  });

  // TODO
  broker.response(eventTypes.rpcEvents.addScooter, async (e) => {
    const newScooter = await scooterManager.addScooter(e.data);
    const scooterAddedEvent = broker.constructEvent(eventTypes.scooterEvents.scooterAdded, newScooter);
    broker.publish(scooterAddedEvent);
    return newScooter;
  });

  // TODO
  broker.response(eventTypes.rpcEvents.updateScooter, (e) => {
    const updatedScooter = scooterManager.updateScooter(e.data);
    const scooterUpdatedEvent = broker.constructEvent(eventTypes.scooterEvents.updatedScooter, updatedScooter);
    broker.publish(scooterUpdatedEvent);
    return updatedScooter;
  });

  // TODO:
  broker.response(eventTypes.rpcEvents.removeScooter, (e) => {
    const removedScooter = scooterManager.removeScooter(e.data.scooterId);
    const removeScooterEvent = broker.constructEvent(eventTypes.scooterEvents.scooterRemoved, removedScooter);
    broker.publish(removeScooterEvent);
    return removedScooter;
  })

}

// TODO: add db

// class ScooterManager {
//   constructor() {
//     console.log("Scooter manager initialized!");
//     this.scooters = scooters;
//   }

//   // TODO: db/options
//   getScooters(options = {}) {
//     let result = this.scooters;

    
//     if (options.hasOwnProperty('location')) {
//       result = result.filter((scooter) => {
//         return scooter.properties.location === options.location;
//       });
//     }

    

//     if (options.hasOwnProperty('scooterId')) {
//       result = result.filter((scooter) => {
//         return scooter.scooterId === options.scooterId;
//       });
//     }

//     return result;
//   }

//   addScooter(newScooterInfo) {
//     const newScooter = {
//       scooterId: 500,
//       status: "inactive",
//       userId: 0,
//       properties: {
//           location: newScooterInfo.location,
//           lat: newScooterInfo.lat,
//           lng: newScooterInfo.lng,
//           speed: 0,
//           battery: 100
//       },
//       log: []
//     }

//     this.scooters.push(newScooter);

//     return newScooter;
//   }

//   // TODO
//   updateScooter(updatedScooter) {
//     for (const scooter of this.scooters) {
//       if (scooter.scooterId === updatedScooter.scooterId) {

//         if (updatedScooter.hasOwnProperty('status')) {
//           scooter.status = updatedScooter.status;
//         }
//         if (updatedScooter.hasOwnProperty('location')) {
//             scooter.properties.location = updatedScooter.location;
//         }
//         if (updatedScooter.hasOwnProperty('lat')) {
//             scooter.properties.lat = updatedScooter.lat;
//         }
//         if (updatedScooter.hasOwnProperty('lng')) {
//             scooter.properties.lng = updatedScooter.lng;
//         }

//         return scooter;
//       }
//     }
    
//   }

//   removeScooter(scooterId) {
//     for (let i = 0; i < this.scooters.length; i++) {
//       if (this.scooters[i].scooterId === scooterId) {
//         const removedScooter = this.scooters.splice(i, 1)[0];
//         return removedScooter;
//       }
//     }
//   }
  
//   /**
//    * Unlock scooter: change info and return scooter data.
//    * @param {number} scooterId 
//    * @param {number} userId 
//    * @returns {object}
//    */
//   unlockScooter(scooterId, userId) {
//     for (const scooter of this.scooters) {
//       if (scooter.scooterId === scooterId) {
//         scooter.status = "claimed";
//         scooter.userId = userId;
//         return scooter;
//       }
//     }
//   }

//   /**
//    * Scooter unlocked: change info and return scooter data.
//    * @param {object} unlockedScooter 
//    * @returns {object}
//    */
//   scooterUnlocked(unlockedScooter) {
//     for (const scooter of this.scooters) {
//       if (scooter.scooterId === unlockedScooter.scooterId) {
//         scooter.status = unlockedScooter.status;
//         scooter.userId = unlockedScooter.userId;
//         console.log(`Scooter ${scooter.scooterId} unlocked`)
//         return scooter;
//       }
//     }
//   }

//   /**
//    * Lock scooter. Change info and return scooter data.
//    * @param {number} scooterId 
//    * @returns {object}
//    */
//   lockScooter(scooterId) {
//     for (const scooter of this.scooters) {
//       if (scooter.scooterId === scooterId) {
//         scooter.status = "available";
//         scooter.userId = 0;
//         return scooter;
//       }
//     }
//   }

//   /**
//    * Scooter locked. Change info and return locked scooter.
//    * @param {object} lockedScooter 
//    * @returns 
//    */
//   scooterLocked(lockedScooter) {
//     for (const scooter of this.scooters) {
//       if (scooter.scooterId === lockedScooter.scooterId) {
//         scooter.status = lockedScooter.status;
//         scooter.userId = lockedScooter.userId;
//         console.log(`Scooter ${scooter.scooterId} locked`)
//         return scooter;
//       }
//     }
//   }

//   /**
//    * Update scooter position info
//    * @param {number} scooterId 
//    * @param {object} position 
//    * @returns {boolean}
//    */
//   updateScooterPosition(scooterId, position) {
//     for (const scooter of this.scooters) {
//       if (scooter.scooterId === scooterId) {
//         scooter.properties.lat = position.lat;
//         scooter.properties.lng = position.lng;
//         console.log(`Scooter ${scooter.scooterId} at lat: ${scooter.properties.lat} lng: ${scooter.properties.lng}.`)
//         return true;
//       }
//     }
//     return false;
//   }
// }


scooterService();
