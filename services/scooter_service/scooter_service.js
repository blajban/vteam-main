
const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes } = require('../../shared/resources');

const { ScooterHandler } = require('./src/scooter_handler');
const { FleetHandler } = require('./src/fleet_handler');
const { MongoWrapper } = require('../../shared/mongowrapper');

// TODO: add update simulation event
// TODO: does the scooters in simulation get updated when the scooters in scooterservice updates/removes?


/**
 * Main function to set up event flow. Listens for events and sends events with the correct data.
 */
const scooterService = async () => {
  const mongoWrapper = await new MongoWrapper("scooters");
  const broker = await new MessageBroker(host, 'scooter_service');
  const fleetHandler = await new FleetHandler(mongoWrapper);
  const scooterHandler = await new ScooterHandler(await fleetHandler.getScooters());

  setInterval(async () => {
    try {
      await fleetHandler.updateScooters(scooterHandler.activeScooters());
    } catch (err) {
      console.log(err);
    }
  }, 4000);


  /**
   * Simulate all scooters
   */
   broker.onEvent(eventTypes.adminEvents.simulateScooters, (e) => {
    try {
      for (const scooter of scooterHandler.activeScooters()) {
        scooter.simulate = true;
        const newEvent = broker.constructEvent(eventTypes.rentScooterEvents.rentScooter, scooter);
        broker.publish(newEvent);
      }
    } catch (err) {
      console.log(err);
    }
    
  });

  /**
   * Stop simulation
   */
  broker.onEvent(eventTypes.adminEvents.stopSimulation, (e) => {
    try {
      for (const scooter of scooterHandler.activeScooters()) {
        scooter.simulate = false;
        const newEvent = broker.constructEvent(eventTypes.returnScooterEvents.parkScooter, scooter);
        broker.publish(newEvent);
      }
    } catch (err) {
      console.log(err);
    }
    
  });

  /**
   * Unlock scooter
   */
  broker.onEvent(eventTypes.rentScooterEvents.rentScooter, (e) => {
    try {
      const newEvent = broker.constructEvent(eventTypes.rentScooterEvents.unlockScooter, scooterHandler.unlockScooter(e.data._id, e.data.userId));
      broker.publish(newEvent);
    } catch (err) {
      console.log(err);
    }
    
  });

  /**
   * Scooter unlocked
   */
  broker.onEvent(eventTypes.rentScooterEvents.scooterUnlocked, (e) => {
    try {
      const newEvent = broker.constructEvent(eventTypes.rentScooterEvents.rideStarted, scooterHandler.scooterUnlocked(e.data));
      broker.publish(newEvent);
    } catch (err) {
      console.log(err);
    }
    
  });

  /**
   * Idle reporting
   */
  broker.onEvent(eventTypes.scooterEvents.scooterIdleReporting, (e) => {
    try {
      scooterHandler.updateScooterPosition(e.data);
    } catch (err) {
      console.log(err);
    }
    
  })

  /**
   * Reporting while moving
   */
  broker.onEvent(eventTypes.scooterEvents.scooterMoving, (e) => {
    try {
      scooterHandler.updateScooterPosition(e.data);
    } catch (err) {
      console.log(err);
    }
    
  })

  // TODO
  broker.onEvent(eventTypes.scooterEvents.batteryLow, (e) => {
    try {
      console.log("Scooter reported low battery!");
    } catch (err) {
      console.log(err);
    }
    
  })

  /**
   * Park scooter
   */
  broker.onEvent(eventTypes.returnScooterEvents.parkScooter, (e) => {
    try {
      const newEvent = broker.constructEvent(eventTypes.returnScooterEvents.lockScooter, scooterHandler.lockScooter(e.data._id));
      broker.publish(newEvent);
    } catch (err) {
      console.log(err);
    }
    
  });

  /**
   * Scooter locked
   */
  broker.onEvent(eventTypes.returnScooterEvents.scooterLocked, (e) => {
    try {
      const newEvent = broker.constructEvent(eventTypes.returnScooterEvents.rideFinished, scooterHandler.scooterLocked(e.data));
      broker.publish(newEvent);
    } catch (err) {
      console.log(err);
    }
    
  });

  // TODO
  broker.onEvent(eventTypes.adminEvents.moveScooter, (e) => {
    try {
      console.log("Admin decided to move a scooter!");
    } catch (err) {
      console.log(err);
    }
    
  });

  /**
   * Get scooters, options in event.
   */
  broker.response(eventTypes.rpcEvents.getScooters, async (e) => {
    try {
      return await fleetHandler.getScooters(e.data);
    } catch (err) {
      console.log(err);
    }
    
  });

  /**
   * Add scooter to db
   */
  broker.response(eventTypes.rpcEvents.addScooter, async (e) => {
    try {
      const newScooter = await fleetHandler.addScooter(e.data);
      const scooterAddedEvent = broker.constructEvent(eventTypes.scooterEvents.scooterAdded, newScooter);
      broker.publish(scooterAddedEvent);
      return newScooter;
    } catch (err) {
      console.log(err);
    }
    
  });

  /**
   * Add random scooters
   */
  broker.onEvent(eventTypes.adminEvents.addRandomScooters, async (e) => {
    try {
      const location = e.data.location;
      const coordinates = {
        'stockholm': {
          lngMin: 17.687988281250004,
          lngMax: 18.391113281250004,
          latMin: 59.17029835064485,
          latMax: 59.478568831926395
        },
        'goteborg': {
          lngMin: 11.744384765625002,
          lngMax: 12.1728515625,
          latMin: 57.610107020683905,
          latMax: 57.856443276115066
        },
        'malmo': {
          lngMin: 12.897949218750002,
          lngMax: 13.205566406250002,
          latMin: 55.49130362820423,
          latMax: 55.64659898563683
        }
      };

      for (let i = 0; i < parseInt(e.data.number); i++) {
        
        const scooterInfo = {
            location: location,
            lat: Math.random() * (coordinates[location].latMax - coordinates[location].latMin) + coordinates[location].latMin,
            lng: Math.random() * (coordinates[location].lngMax - coordinates[location].lngMin) + coordinates[location].lngMin,
          }


        const newScooter = await fleetHandler.addScooter(scooterInfo);
        const scooterAddedEvent = broker.constructEvent(eventTypes.scooterEvents.scooterAdded, newScooter);
        broker.publish(scooterAddedEvent);
      }
    } catch (err) {
      console.log(err);
    }
  });

  /**
   * Update active scooters
   */
  broker.onEvent(eventTypes.scooterEvents.scooterAdded, (e) => {
    try {
      scooterHandler.addActiveScooter(e.data);
    } catch (err) {
      console.log(err);
    }
    
  });

  /**
   * Update scooter
   */
  broker.response(eventTypes.rpcEvents.updateScooter, async (e) => {
    try {
      const updatedScooter = await fleetHandler.updateScooter(e.data);
      const scooterUpdatedEvent = broker.constructEvent(eventTypes.scooterEvents.updatedScooter, updatedScooter);
      broker.publish(scooterUpdatedEvent);
      return updatedScooter;
    } catch (err) {
      console.log(err);
    }
    
  });

  /**
   * Update active scooters
   */
  broker.onEvent(eventTypes.scooterEvents.updatedScooter, (e) => {
    try {
      scooterHandler.updateActiveScooter(e.data);
    } catch (err) {
      console.log(err);
    }
    
  });

  /**
   * Remove scooter
   */
  broker.response(eventTypes.rpcEvents.removeScooter, async (e) => {
    try {
      const removedScooter = await fleetHandler.removeScooter(e.data);
      const removeScooterEvent = broker.constructEvent(eventTypes.scooterEvents.scooterRemoved, removedScooter);
      broker.publish(removeScooterEvent);
      return removedScooter;
    } catch (err) {
      console.log(err);
    }
  })

  /**
   * Remove active scooter
   */
  broker.onEvent(eventTypes.scooterEvents.scooterRemoved, (e) => {
    try {
      scooterHandler.removeActiveScooter(e.data);
    } catch (err) {
      console.log(err);
    }
    
  })

}


scooterService();

module.exports = { scooterService };