

const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes } = require('../../shared/resources');


const main = async () => {

  /**
   * Scooter reporting while idle.
   * @param {object} scooter 
   */
  const idleReporting = (scooter) => {
    const idleEvent = broker.constructEvent(eventTypes.scooterEvents.scooterIdleReporting, scooter);
    broker.publish(idleEvent);
  }

  /**
   * Unlock scooter and update status.
   * @param {object} scooter 
   * @param {string} status 
   * @param {number} userId 
   */
  const unlockScooter = (scooter, status, userId) => {
    console.log("UNLOCKING")
    scooter.status = status;
    scooter.userId = userId;
    const unlockEvent = broker.constructEvent(eventTypes.rentScooterEvents.scooterUnlocked, scooter);
    broker.publish(unlockEvent);
    console.log(`Scooter ${scooter._id} unlocked`)
  }

  /**
   * Lock scooter and update status.
   * @param {object} scooter 
   * @param {string} status 
   * @param {number} userId 
   * @param {object} startEndTime 
   */
  const lockScooter = (scooter, status, userId, startEndTime) => {
    scooter.status = status;
    scooter.userId = userId;
    scooter.log.push(startEndTime);
    const lockEvent = broker.constructEvent(eventTypes.returnScooterEvents.scooterLocked, scooter);
    broker.publish(lockEvent);
    console.log(`Scooter ${scooter._id} locked`)
  }

  /**
   * Report while driving
   * @param {object} scooter 
   */
  const reportWhileMoving = (scooter) => {
    console.log(`Scooter ${scooter._id} driving!`);
    const moveEvent = broker.constructEvent(eventTypes.scooterEvents.scooterMoving, scooter);
    broker.publish(moveEvent);

    if (scooter.battery < 20) {
      const batteryEvent = broker.constructEvent(eventTypes.scooterEvents.batteryLow, scooter);
      broker.publish(batteryEvent);
    }

    if (outOfBounds({lat: scooter.lat, lng: scooter.lng})) {
      const outsideEvent = broker.constructEvent(eventTypes.scooterEvents.outOfBounds, scooter);
      broker.publish(outsideEvent);
    }
  }

  // TODO: Check if scooter is still inside permitted zone
  const outOfBounds = (scooterPosition) => {
    return false;
  }

  // TODO
  const simulateScooter = (scooter) => {
    console.log("Simulating!!");
    scooter.properties.lat = scooter.properties.lat + 0.005;
    scooter.properties.lng = scooter.properties.lng + 0.005;
    scooter.properties.battery--;
  }

  /**
   * Main program
   */
  const serviceName = 'simulation';
  const intervals = {};
  const logs = {};

  const broker = await new MessageBroker(host, serviceName);
    
  /**
   * Get scooters from scooter service
   */
  const req = broker.constructEvent(eventTypes.rpcEvents.getScooters, {});
  broker.request(req, (res) => {
    const scooters = res;
    console.log(`Initialised ${scooters.length} scooters from scooter_service...`);

    /**
     * Set eventlisteners and intervals for all scooters
     */
    for (let i = 0; i < scooters.length; i++) {
      setInterval(() => {
          idleReporting(scooters[i]);
      }, 30000);

      /**
       * Set the rest of event listeners in for loop
       */

      /**
       * Unlock scooter
       */
      broker.onEvent(eventTypes.rentScooterEvents.unlockScooter, (e) => {
        console.log(e.data);
        if (scooters[i]._id === e.data._id) {
          unlockScooter(scooters[i], e.data.status, e.data.userId);
          // Log start time
          logs[i] = {
            start: new Date()
          };

          console.log(scooters[i]);

          // Report while driving
          const drive = setInterval(() => {
            reportWhileMoving(scooters[i]);

            console.log(e.data);
            if (e.data.simulate) {
              simulateScooter(scooters[i]);
            }
          }, 3000);

          // Save interval id to be able to remove it later
          intervals[i] = drive;
          
          
        }
      });

      

      /**
       * Lock scooter
       */
      broker.onEvent(eventTypes.returnScooterEvents.lockScooter, (e) => {
        if (scooters[i]._id === e.data._id) {
          const logRideFinished = Object.assign(logs[i], { end: new Date() });
          lockScooter(scooters[i], e.data.status, e.data.userId, logRideFinished);
          
          // Remove report-while-driving interval
          clearInterval(intervals[i]);
        }
      });

      
      

    }


  });

  // TODO
  broker.onEvent(eventTypes.scooterEvents.scooterAdded, (e) => {
    console.log(e);
  });
  
} 





main();


// Function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  // Convert degrees to radians
  lat1 = lat1 * (Math.PI / 180);
  lon1 = lon1 * (Math.PI / 180);
  lat2 = lat2 * (Math.PI / 180);
  lon2 = lon2 * (Math.PI / 180);

  // Calculate distance using the "flat Earth" formula
  let x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
  let y = lat2 - lat1;
  let d = Math.sqrt(x * x + y * y) * 6371; // 6371 is the approximate radius of the Earth in kilometers

  return d;
}

// Example usage
//let distance = calculateDistance(50.0755, 14.4378, 52.5186, 13.4083);
//console.log(distance); // Output: 281.4 (kilometers)


// Function to calculate current speed
function calculateSpeed(lat1, lon1, lat2, lon2, time1, time2) {
  // Calculate distance between coordinates
  let x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
  let y = lat2 - lat1;
  let d = Math.sqrt(x * x + y * y) * 6371; // Distance in kilometers

  // Calculate time difference in hours
  let t = (time2 - time1) / 3600; // Time in hours

  // Calculate speed in kilometers per hour
  let speed = d / t;

  return speed;
}

// Example usage
//let speed = calculateSpeed(50.0755, 14.4378, 52.5186, 13.4083, Date.now(), Date.now() + 1800000);
//console.log(speed); // Output: approximately 81.4 (kilometers per hour)

