const { eventTypes } = require('../../../shared/resources');

class Controller {
  constructor(broker, scooterHandler, fleetHandler) {
    this.broker = broker;
    this.scooterHandler = scooterHandler;
    this.fleetHandler = fleetHandler;
  }

  /**
   * Simulate all scooters
   */
  simulateScooters(e) {
    try {
      for (const scooter of this.scooterHandler.activeScooters()) {
        scooter.simulate = true;
        const newEvent = this.broker.constructEvent(
          eventTypes.rentScooterEvents.rentScooter,
          scooter,
        );
        this.broker.publish(newEvent);
      }
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Stop simulation
   */
  stopSimulation(e) {
    try {
      for (const scooter of this.scooterHandler.activeScooters()) {
        scooter.simulate = false;
        const newEvent = this.broker.constructEvent(
          eventTypes.returnScooterEvents.parkScooter,
          scooter,
        );
        this.broker.publish(newEvent);
      }
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Unlock scooter
   */
  unlockScooter(e) {
    try {
      const newEvent = this.broker.constructEvent(
        eventTypes.rentScooterEvents.unlockScooter,
        this.scooterHandler.unlockScooter(e.data._id, e.data.userId),
      );
      this.broker.publish(newEvent);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Scooter unlocked
   */
  scooterUnlocked(e) {
    try {
      const newEvent = this.broker.constructEvent(
        eventTypes.rentScooterEvents.rideStarted,
        this.scooterHandler.scooterUnlocked(e.data),
      );
      this.broker.publish(newEvent);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Idle reporting
   */
  idleReporting(e) {
    try {
      this.scooterHandler.updateScooterPosition(e.data);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Scooter moving
   */
  scooterMoving(e) {
    try {
      this.scooterHandler.updateScooterPosition(e.data);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Park scooter
   */
  parkScooter(e) {
    try {
      const newEvent = this.broker.constructEvent(
        eventTypes.returnScooterEvents.lockScooter,
        this.scooterHandler.lockScooter(e.data._id),
      );
      this.broker.publish(newEvent);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Scooter locked
   */
  scooterLocked(e) {
    try {
      const newEvent = this.broker.constructEvent(
        eventTypes.returnScooterEvents.rideFinished,
        this.scooterHandler.scooterLocked(e.data),
      );
      this.broker.publish(newEvent);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Get scooters, options in event.
   */
  async getScooters(e) {
    try {
      return await this.fleetHandler.getScooters(e.data);
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  }

  /**
   * Add scooter to db
   */
  async addScooter(e) {
    try {
      const newScooter = await this.fleetHandler.addScooter(e.data);
      const scooterAddedEvent = this.broker.constructEvent(
        eventTypes.scooterEvents.scooterAdded,
        newScooter,
      );
      this.broker.publish(scooterAddedEvent);
      return newScooter;
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  }

  /**
   * Add random scooters
   */
  async addRandomScooters(e) {
    try {
      const coordinates = {
        stockholm: {
          lngMin: 17.687988281250004,
          lngMax: 18.391113281250004,
          latMin: 59.17029835064485,
          latMax: 59.478568831926395,
        },
        goteborg: {
          lngMin: 11.744384765625002,
          lngMax: 12.1728515625,
          latMin: 57.610107020683905,
          latMax: 57.856443276115066,
        },
        malmo: {
          lngMin: 12.897949218750002,
          lngMax: 13.205566406250002,
          latMin: 55.49130362820423,
          latMax: 55.64659898563683,
        },
      };

      for (let i = 0; i < parseInt(e.data.number); i += 1) {
        const scooterInfo = {
          location: e.data.location,
          lat: Math.random() *
            (coordinates[e.data.location].latMax - coordinates[e.data.location].latMin) +
            coordinates[e.data.location].latMin,
          lng: Math.random() *
            (coordinates[e.data.location].lngMax - coordinates[e.data.location].lngMin) +
            coordinates[e.data.location].lngMin,
        };

        const newScooter = await this.fleetHandler.addScooter(scooterInfo);
        const scooterAddedEvent = this.broker.constructEvent(
          eventTypes.scooterEvents.scooterAdded,
          newScooter,
        );
        this.broker.publish(scooterAddedEvent);
      }
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Add active scooter
   */
  addActiveScooter(e) {
    try {
      this.scooterHandler.addActiveScooter(e.data);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Update scooter
   */
  async updateScooter(e) {
    try {
      const updatedScooter = await this.fleetHandler.updateScooter(e.data);
      const scooterUpdatedEvent = this.broker.constructEvent(
        eventTypes.scooterEvents.scooterUpdated,
        updatedScooter,
      );
      this.broker.publish(scooterUpdatedEvent);
      return updatedScooter;
    } catch (err) {
      return { error: err };
    }
  }

  /**
   * Update active scooter
   */
  updateActiveScooter(e) {
    try {
      this.scooterHandler.updateActiveScooter(e.data);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Remove scooter
   */
  async removeScooter(e) {
    try {
      const removedScooter = await this.fleetHandler.removeScooter(e.data);
      const removeScooterEvent = this.broker.constructEvent(
        eventTypes.scooterEvents.scooterRemoved,
        removedScooter,
      );
      this.broker.publish(removeScooterEvent);
      return removedScooter;
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  }

  /**
   * Remove active scooter
   */
  removeActiveScooter(e) {
    try {
      this.scooterHandler.removeActiveScooter(e.data);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = { Controller };
