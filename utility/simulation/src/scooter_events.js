const { eventTypes } = require('../../../shared/resources');

const whileDrivingIntervalTime = 3000;
const whileIdleIntervalTime = 20000;

/**
 * Handle scooter events
 */
class ScooterEvents {
  /**
   * @param {object} messageBroker
   */
  constructor(messageBroker) {
    this.broker = messageBroker;
  }

  /**
   * Initializes events for the supplied scooter.
   * @param {Scooter} scooter
   */
  init(scooter) {
    // Idle reporting.
    const interval = setInterval(() => {
      const idleEvent = this.broker.constructEvent(
        eventTypes.scooterEvents.scooterIdleReporting,
        scooter.getScooterInfo(),
      );
      this.broker.publish(idleEvent);
    }, whileIdleIntervalTime);
    scooter.activate(interval);

    // Unlock scooter.
    this.broker.onEvent(eventTypes.rentScooterEvents.unlockScooter, (e) => {
      if (scooter.getScooterInfo()._id === e.data._id) {
        const drive = setInterval(() => {
          this.reportWhileMoving(scooter);
          if (e.data.simulate) {
            scooter.simulateScooter();
          }
        }, whileDrivingIntervalTime);
        scooter.unlockScooter(drive, whileDrivingIntervalTime, e.data.status, e.data.userId);
        const scooterUnlockedEvent = this.broker.constructEvent(
          eventTypes.rentScooterEvents.scooterUnlocked,
          scooter.getScooterInfo(),
        );
        this.broker.publish(scooterUnlockedEvent);
      }
    });

    // Lock scooter.
    this.broker.onEvent(eventTypes.returnScooterEvents.lockScooter, (e) => {
      if (scooter.getScooterInfo()._id === e.data._id) {
        scooter.lockScooter(e.data.status, e.data.userId);
        const scooterLockedEvent = this.broker.constructEvent(
          eventTypes.returnScooterEvents.scooterLocked,
          scooter.getScooterInfo(),
        );
        this.broker.publish(scooterLockedEvent);
      }
    });
  }

  /**
   * Emit events while the scooter is moving.
   * @param {Scooter} scooter
   */
  reportWhileMoving(scooter) {
    const scooterInfo = scooter.getScooterInfo();
    const moveEvent = this.broker.constructEvent(
      eventTypes.scooterEvents.scooterMoving,
      scooterInfo,
    );
    this.broker.publish(moveEvent);

    if (scooter.lowBattery()) {
      const batteryEvent = this.broker.constructEvent(
        eventTypes.scooterEvents.batteryLow,
        scooterInfo,
      );
      this.broker.publish(batteryEvent);
    }

    if (scooter.outOfBounds()) {
      const outsideEvent = this.broker.constructEvent(
        eventTypes.scooterEvents.outOfBounds,
        scooterInfo,
      );
      this.broker.publish(outsideEvent);
    }
  }
}

module.exports = { ScooterEvents };
