

const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes, coordinates } = require('../../shared/resources');

const whileDrivingIntervalTime = 3000;
const whileIdleIntervalTime = 20000;



class Scooter {
  constructor(scooterInfo) {
    this.info = scooterInfo;
    this.info.log = scooterInfo.log || [];

    this.vx = 0;
    this.vy = 0;
    this.tick = 0;
    this.angle = 0;
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
    this.info.properties.speed = 0;
    
    this.startTime = null;
    clearInterval(this.driveInterval);
  }

  simulateScooter() {
    console.log(`Simulating scooter ${this.info._id}!`);

    // Set movement angle
    if (this.tick > 3) {
      this.angle += Math.random() * 20 + 10;
      this.angle %= 360;
      this.tick = 0;
    };

    // Move scooter and update position
    let acceleration = Math.random() * 10; // in meters per second squared

    this.vx = acceleration * Math.cos(this.angle);  // In meters per second
    this.vy = acceleration * Math.sin(this.angle);

    const distanceX = this.vx * whileDrivingIntervalTime / 1000;
    const distanceY = this.vy * whileDrivingIntervalTime / 1000;

    const latDistance = distanceY / 111111;
    const lngDistance = distanceX / (111111 * Math.cos(this.info.properties.lat * Math.PI / 180));

    this.info.properties.lat += latDistance;
    this.info.properties.lng += lngDistance;

    // Calculate speed
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    const speed = (distance / (whileDrivingIntervalTime / 1000));

    this.info.properties.speed = speed * 3.6;

    // Battery and new tick
    this.info.properties.battery--;
    this.tick++;

    console.log(`Scooter speed: ${this.info.properties.speed} km/h`);

  }

  activate(idleInterval) {
    console.log(`Activating ${this.info._id}`);
    this.idleInterval = idleInterval;
  }
  
  remove() {
    console.log(`Removing ${this.info._id}`);
    clearInterval(this.idleInterval);
  }

  update(newScooterInfo) {
    this.info = newScooterInfo;
  }

  lowBattery() {
    return this.info.properties.battery < 20;
  }

  outOfBounds() {
    if (this.info.properties.lat < coordinates[this.info.properties.location].latMin ||
      this.info.properties.lat > coordinates[this.info.properties.location].latMax) {
      return true;
    }
    
    if (this.info.properties.lng < coordinates[this.info.properties.location].lngMin ||
      this.info.properties.lng > coordinates[this.info.properties.location].lngMax) {
      return true;
    }

    return false;
  }
}



const main = async () => {
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
    }, whileIdleIntervalTime);
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
        }, whileDrivingIntervalTime);
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

  broker.onEvent(eventTypes.scooterEvents.scooterUpdated, (e) => {
    for (let i = 0; i < scooters.length; i++) {
      if (scooters[i].getScooterInfo()._id === e.data._id) {
        scooters[i].update(e.data);
      }
    }
    console.log(`Updated scooter`);
  })

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

main();

