const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes } = require('../../shared/resources');

const { ScooterHandler } = require('./src/scooter_handler');
const { FleetHandler } = require('./src/fleet_handler');
const { MongoWrapper } = require('../../shared/mongowrapper');

const { Controller } = require('./src/controller');

/**
 * Main function to set up event flow. Listens for events and sends events with the correct data.
 */
const scooterService = async () => {
  const mongoWrapper = await new MongoWrapper('scooters');
  const broker = await new MessageBroker(host, 'scooter_service');
  const fleetHandler = await new FleetHandler(mongoWrapper);
  const scooterHandler = await new ScooterHandler(await fleetHandler.getScooters());
  const controller = new Controller(broker, scooterHandler, fleetHandler);

  setInterval(async () => {
    try {
      await fleetHandler.updateScooters(scooterHandler.activeScooters());
    } catch (err) {
      console.log(err);
    }
  }, 4000);

  // Simulate scooters
  broker.onEvent(
    eventTypes.adminEvents.simulateScooters,
    controller.simulateScooters.bind(controller),
  );
  broker.onEvent(
    eventTypes.adminEvents.stopSimulation,
    controller.stopSimulation.bind(controller),
  );

  // Idle and rent scooter
  broker.onEvent(
    eventTypes.rentScooterEvents.rentScooter,
    controller.unlockScooter.bind(controller),
  );
  broker.onEvent(
    eventTypes.rentScooterEvents.scooterUnlocked,
    controller.scooterUnlocked.bind(controller),
  );1500
  broker.onEvent(
    eventTypes.scooterEvents.scooterMoving,
    controller.scooterMoving.bind(controller),
  );
  broker.onEvent(
    eventTypes.scooterEvents.scooterIdleReporting,
    controller.idleReporting.bind(controller),
  );

  // Park scooter
  broker.onEvent(
    eventTypes.returnScooterEvents.parkScooter,
    controller.parkScooter.bind(controller),
  );
  broker.onEvent(
    eventTypes.returnScooterEvents.scooterLocked,
    controller.scooterLocked.bind(controller),
  );
  broker.onEvent(
    eventTypes.adminEvents.addRandomScooters,
    controller.addRandomScooters.bind(controller),
  );

  // RPC events
  broker.response(
    eventTypes.rpcEvents.getScooters,
    controller.getScooters.bind(controller),
  );
  broker.response(
    eventTypes.rpcEvents.addScooter,
    controller.addScooter.bind(controller),
  );
  broker.response(
    eventTypes.rpcEvents.updateScooter,
    controller.updateScooter.bind(controller),
  );
  broker.response(
    eventTypes.rpcEvents.removeScooter,
    controller.removeScooter.bind(controller),
  );

  // Adjust active scooter events
  broker.onEvent(
    eventTypes.scooterEvents.scooterAdded,
    controller.addActiveScooter.bind(controller),
  );
  broker.onEvent(
    eventTypes.scooterEvents.scooterUpdated,
    controller.updateActiveScooter.bind(controller),
  );
  broker.onEvent(
    eventTypes.scooterEvents.scooterRemoved,
    controller.removeActiveScooter.bind(controller),
  );

  // TODO
  broker.onEvent(eventTypes.adminEvents.moveScooter, (e) => {
    try {
      console.log('Admin decided to move a scooter!"');
      console.log(e);
    } catch (err) {
      console.log(err);
    }
  });

  // TODO
  broker.onEvent(eventTypes.scooterEvents.batteryLow, (e) => {
    try {
      console.log('Scooter reported low battery!');
      console.log(e);
    } catch (err) {
      console.log(err);
    }
  });
};

scooterService();

module.exports = { scooterService };
