const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes } = require('../../shared/resources');
const { ScooterEvents } = require('./src/scooter_events');
const { Scooter } = require('./src/scooter');

/**
 * Initializes the simulation.
 */
const main = async () => {
  const serviceName = 'simulation';
  const scooters = [];
  const broker = await new MessageBroker(host, serviceName);
  const scooterEvents = new ScooterEvents(broker);

  const req = broker.constructEvent(eventTypes.rpcEvents.getScooters, {});
  broker.request(req, (res) => {
    for (const obj of res) {
      const scooter = new Scooter(obj);
      scooterEvents.init(scooter);
      scooters.push(scooter);
    }
  });

  broker.onEvent(eventTypes.scooterEvents.scooterAdded, (e) => {
    const scooter = new Scooter(e.data);
    scooterEvents.init(scooter);
    scooters.push(scooter);
  });

  broker.onEvent(eventTypes.scooterEvents.scooterUpdated, (e) => {
    for (let i = 0; i < scooters.length; i++) {
      if (scooters[i].getScooterInfo()._id === e.data._id) {
        scooters[i].update(e.data);
      }
    }
  });

  const removeFromSim = (scooter) => {
    for (let i = 0; i < scooters.length; i++) {
      if (scooters[i].getScooterInfo()._id === scooter._id) {
        scooters[i].remove();
        scooters.splice(i, 1);
        break;
      }
    }
  };

  broker.onEvent(eventTypes.scooterEvents.scooterRemoved, (e) => {
    removeFromSim(e.data);
  });

  broker.onEvent(eventTypes.scooterEvents.lowBatteryRemoved, (e) => {
    removeFromSim(e.data);
  });
};

// Run simulation
main();
