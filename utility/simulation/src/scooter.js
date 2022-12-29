const { coordinates } = require('../../../shared/resources');

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

  unlockScooter(driveInterval, driveIntervalTime, status, userId) {
    console.log(`Unlocking ${this.info._id}`);
    this.info.status = status;
    this.info.userId = userId;
    this.startTime = new Date();
    this.driveInterval = driveInterval;
    this.driveIntervalTime = driveIntervalTime;
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

    const distanceX = this.vx * this.driveIntervalTime / 1000;
    const distanceY = this.vy * this.driveIntervalTime / 1000;

    const latDistance = distanceY / 111111;
    const lngDistance = distanceX / (111111 * Math.cos(this.info.properties.lat * Math.PI / 180));

    this.info.properties.lat += latDistance;
    this.info.properties.lng += lngDistance;

    // Calculate speed
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    const speed = (distance / (this.driveIntervalTime / 1000));

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

    module.exports = { Scooter };
