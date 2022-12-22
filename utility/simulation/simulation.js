

const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes } = require('../../shared/resources');

class Scooter {
  constructor(scooterInfo) {
    this.info = scooterInfo;
    this.info.log = scooterInfo.log || [];
    this.last = {
      lat: this.info.properties.lat,
      lng: this.info.properties.lng,
      time: new Date()
    };
  }

  getScooterInfo() {
    return this.info;
  }

  unlockScooter(driveInterval, status, userId) {
    console.log(`Unlocking ${this.info._id}`);
    this.info.status = status;
    this.info.userId = userId;
    this.startTime = new Date();
    this.driveInterval = driveInterval;
  }

  lockScooter(status, userId) {
    console.log(`Locking ${this.info._id}`);
    this.info.log.push({
      userId: this.info.userId,
      start: this.startTime,
      end: new Date() 
    });
    this.info.status = status;
    this.info.userId = userId;
    
    this.startTime = null;
    clearInterval(this.driveInterval);
  }

  simulateScooter() {
    console.log(`Simulating scooter ${this.info._id}!`);

    // For use to calculate speed
    this.last = {
      lat: this.info.properties.lat,
      lng: this.info.properties.lng
    };

    this.info.properties.lat = this.info.properties.lat + 0.005;
    this.info.properties.lng = this.info.properties.lng + 0.005;
    this.info.speed = this.calculateSpeed();
    this.info.properties.battery--;
  }

  activate(idleInterval) {
    console.log(`Activating ${this.info._id}`);
    this.idleInterval = idleInterval;
  }
  
  remove() {
    console.log(`Removing ${this.info._id}`);
    clearInterval(this.idleInterval);
  }

  lowBattery() {
    return this.info.properties.battery < 20;
  }

  outOfBounds() {
    return false;
  }

  calculateSpeed() {
    return 80;
  }



}



const newMain = async () => {

  /**
   * Emit events while driving for the scooter object.
   * @param {Scooter} scooter 
   */
  const reportWhileMoving = (scooter) => {
    const scooterInfo = scooter.getScooterInfo();
    console.log(`Scooter ${scooterInfo._id} driving!`);
    const moveEvent = broker.constructEvent(eventTypes.scooterEvents.scooterMoving, scooterInfo);
    broker.publish(moveEvent);

    if (scooter.lowBattery()) {
      const batteryEvent = broker.constructEvent(eventTypes.scooterEvents.batteryLow, scooterInfo);
      broker.publish(batteryEvent);
    }

    if (scooter.outOfBounds()) {
      const outsideEvent = broker.constructEvent(eventTypes.scooterEvents.outOfBounds, scooterInfo);
      broker.publish(outsideEvent);
    }
  }

  /**
   * Set up all events for a scooter object.
   * @param {Scooter} scooter 
   */
  const setupScooterEvents = async (scooter) => {

    // Idle reporting.
    const interval = setInterval(() => {
      const idleEvent = broker.constructEvent(eventTypes.scooterEvents.scooterIdleReporting, scooter.getScooterInfo());
      broker.publish(idleEvent);
    }, 20000);
    scooter.activate(interval);

    // Unlock scooter.
    broker.onEvent(eventTypes.rentScooterEvents.unlockScooter, (e) => {
      if (scooter.getScooterInfo()._id === e.data._id) {
        const drive = setInterval(() => {
          reportWhileMoving(scooter);
          if (e.data.simulate) {
            console.log("simulating!");
            scooter.simulateScooter();
          }
        }, 3000);
        scooter.unlockScooter(drive, e.data.status, e.data.userId);
        const scooterUnlockedEvent = broker.constructEvent(eventTypes.rentScooterEvents.scooterUnlocked, scooter.getScooterInfo());
        broker.publish(scooterUnlockedEvent);
      }
    });

    // Lock scooter.
    broker.onEvent(eventTypes.returnScooterEvents.lockScooter, (e) => {
      if (scooter.getScooterInfo()._id === e.data._id) {
        scooter.lockScooter(e.data.status, e.data.userId);
        const scooterLockedEvent = broker.constructEvent(eventTypes.returnScooterEvents.scooterLocked, scooter.getScooterInfo());
        broker.publish(scooterLockedEvent);
      }
    });
  }

  const serviceName = 'simulation';
  const scooters = [];
  const broker = await new MessageBroker(host, serviceName);

  const req = broker.constructEvent(eventTypes.rpcEvents.getScooters, {});
  broker.request(req, (res) => {
    for (const obj of res) {
      const scooter = new Scooter(obj);
      setupScooterEvents(scooter);
      scooters.push(scooter);
    }
    console.log(`Initialised ${scooters.length} scooters from scooter_service...`);

  });

  broker.onEvent(eventTypes.scooterEvents.scooterAdded, (e) => {
    const scooter = new Scooter(e.data);
    setupScooterEvents(scooter);
    scooters.push(scooter);
    console.log(`Scooter added for a total of ${scooters.length} scooters.`);
  });

  broker.onEvent(eventTypes.scooterEvents.scooterRemoved, (e) => {
    for (let i = 0; i < scooters.length; i++) {
      if (scooters[i].getScooterInfo()._id === e.data._id) {
        scooters[i].remove();
        scooters.splice(i, 1);
      }
    }
    console.log(`Removed scooter (${scooters.length} scooters still in action)`);
  });

}


newMain();

