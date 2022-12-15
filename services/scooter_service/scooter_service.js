
const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes } = require('../../shared/resources');

const { ScooterHandler } = require('./scooter_handler');
const { FleetHandler } = require('./fleet_handler');

// TODO: add update simulation event
// TODO: does the scooters in simulation get updated when the scooters in scooterservice updates/removes?


/**
 * Main function to set up event flow. Listens for events and sends events with the correct data.
 */
const scooterService = async () => {

  const broker = await new MessageBroker(host, 'scooter_service');
  const fleetHandler = await new FleetHandler();

  const scooterHandler = await new ScooterHandler(await fleetHandler.getScooters());

  setInterval(async () => {
    await fleetHandler.updateScooters(scooterHandler.activeScooters());
  }, 15000);


  /** TODO
   * Simulate all scooters
   */
   broker.onEvent(eventTypes.adminEvents.simulateScooters, (e) => {
    for (const scooter of scooterHandler.activeScooters()) {
      const newEvent = broker.constructEvent(eventTypes.rentScooterEvents.rentScooter, scooter);
      broker.publish(newEvent);
    }
  });

  /** TODO
   * Stop simulation
   */
   broker.onEvent(eventTypes.adminEvents.stopSimulation, (e) => {
    for (const scooter of scooterHandler.activeScooters()) {
      const newEvent = broker.constructEvent(eventTypes.returnScooterEvents.parkScooter, scooter);
      broker.publish(newEvent);
    }
  });

  /**
   * Unlock scooter
   */
   broker.onEvent(eventTypes.rentScooterEvents.rentScooter, (e) => {
    console.log(e.data)
    const newEvent = broker.constructEvent(eventTypes.rentScooterEvents.unlockScooter, scooterHandler.unlockScooter(e.data._id, e.data.userId));
    broker.publish(newEvent);
  });

  /**
   * Scooter unlocked
   */
   broker.onEvent(eventTypes.rentScooterEvents.scooterUnlocked, (e) => {
    const newEvent = broker.constructEvent(eventTypes.rentScooterEvents.rideStarted, scooterHandler.scooterUnlocked(e.data));
    broker.publish(newEvent);
  });

  /**
   * Idle reporting
   */
   broker.onEvent(eventTypes.scooterEvents.scooterIdleReporting, (e) => {
    scooterHandler.updateScooterPosition(e.data);
  })

  /**
   * Reporting while moving
   */
   broker.onEvent(eventTypes.scooterEvents.scooterMoving, (e) => {
    scooterHandler.updateScooterPosition(e.data);
  })

  // TODO
  broker.onEvent(eventTypes.scooterEvents.batteryLow, (e) => {
    console.log("Scooter reported low battery!");
  })

  /** TODO
   * Park scooter
   */
   broker.onEvent(eventTypes.returnScooterEvents.parkScooter, (e) => {
    const newEvent = broker.constructEvent(eventTypes.returnScooterEvents.lockScooter, scooterHandler.lockScooter(e.data._id));
    broker.publish(newEvent);
  });

  /** TODO
   * Scooter locked
   */
   broker.onEvent(eventTypes.returnScooterEvents.scooterLocked, (e) => {
    const newEvent = broker.constructEvent(eventTypes.returnScooterEvents.rideFinished, scooterHandler.scooterLocked(e.data));
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
    return await fleetHandler.getScooters(e.data);
  });

  /**
   * Add scooter to db
   */
  broker.response(eventTypes.rpcEvents.addScooter, async (e) => {
    const newScooter = await fleetHandler.addScooter(e.data);
    const scooterAddedEvent = broker.constructEvent(eventTypes.scooterEvents.scooterAdded, newScooter);
    broker.publish(scooterAddedEvent);
    return newScooter;
  });

  /**
   * Update active scooters
   */
  broker.onEvent(eventTypes.scooterEvents.scooterAdded, (e) => {
    scooterHandler.addActiveScooter(e.data);
  });

  /**
   * Update scooter
   */
  broker.response(eventTypes.rpcEvents.updateScooter, async (e) => {
    const updatedScooter = await fleetHandler.updateScooter(e.data);
    const scooterUpdatedEvent = broker.constructEvent(eventTypes.scooterEvents.updatedScooter, updatedScooter);
    broker.publish(scooterUpdatedEvent);
    return updatedScooter;
  });

  /**
   * Update active scooters
   */
  broker.onEvent(eventTypes.scooterEvents.updatedScooter, (e) => {
    scooterHandler.updateActiveScooter(e.data);
  });

  /**
   * Remove scooter
   */
  broker.response(eventTypes.rpcEvents.removeScooter, async (e) => {
    const removedScooter = await fleetHandler.removeScooter(e.data);
    const removeScooterEvent = broker.constructEvent(eventTypes.scooterEvents.scooterRemoved, removedScooter);
    broker.publish(removeScooterEvent);
    return removedScooter;
  })

  /**
   * Remove active scooter
   */
  broker.onEvent(eventTypes.scooterEvents.scooterRemoved, (e) => {
    scooterHandler.removeActiveScooter(e.data);
  })

}


scooterService();
