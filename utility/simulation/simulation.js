

const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes, exchanges } = require('../../shared/resources');


const main = async () => {

  /**
   * Scooter reporting while idle.
   * @param {Object} scooter 
   */
  const idleReporting = (scooter) => {
    //console.log(`Scooter ${scooter.scooterId} reporting!`);
    const newEvent = broker.constructEvent(eventTypes.scooterEvents.scooterIdleReporting, scooter);
    broker.publish(newEvent);
  }

  /**
   * Unlock scooter and update status
   * @param {Object} scooter 
   * @param {number} userId 
   */
  const unlockScooter = (scooter, status, userId) => {
    scooter.status = status;
    scooter.userId = userId;
    const newEvent = broker.constructEvent(eventTypes.rentScooterEvents.scooterUnlocked, scooter);
    broker.publish(newEvent);
    console.log(`Scooter ${scooter.scooterId} unlocked`)
  }

  /**
   * Lock scooter and update status
   * @param {Object} scooter 
   * @param {Object} startEndTime 
   */
  const lockScooter = (scooter, status, userId, startEndTime) => {
    scooter.status = status;
    scooter.userId = userId;
    scooter.log.push(startEndTime);
    const newEvent = broker.constructEvent(eventTypes.returnScooterEvents.scooterLocked, scooter);
    broker.publish(newEvent);
    console.log(`Scooter ${scooter.scooterId} locked`)
  }

  const reportWhileMoving = (scooter) => {
    console.log(`Scooter ${scooter.scooterId} driving!`);
    const newEvent = broker.constructEvent(eventTypes.scooterEvents.scooterMoving, scooter);
    broker.publish(newEvent);
  }

  /**
   * Main program
   */
  const serviceName = 'simulation';
  const intervals = {};
  const logs = {};

  const broker = await new MessageBroker(host, exchanges.scooters, serviceName);
  

  /**
   * Listen for event to start all scooters in db
   */
  broker.onEvent(eventTypes.adminEvents.startScooters, (e) => {
    console.log(`'${e.eventType}' event received. Initialising scooters...`)
    
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
        }, 10000);

        /**
         * Set the rest of event listeners in for loop
         */

        /**
         * Unlock scooter
         */
        broker.onEvent(eventTypes.rentScooterEvents.unlockScooter, (e) => {
          if (scooters[i].scooterId === e.data.scooterId) {
            unlockScooter(scooters[i], e.data.status, e.data.userId);
            // Log start time
            logs[i] = {
              start: new Date()
            };

            console.log(scooters[i]);

            // Report while driving
            const drive = setInterval(() => {
              

              reportWhileMoving(scooters[i]);

              // update scooter status
              //simulateDriving(i)

              // Low battery
              //if (scooterInfo[i].status.battery < 20) {
                //  const newEvent = broker.constructEvent(eventTypes.scooterEvents.batteryLow, scooterInfo[i]);
                 // broker.publish(newEvent);
              //}

              // Outside boundaries
              //if (outOfBounds(scooterInfo[i].status.long, scooterInfo[i].status.lat)) {
              //    const newEvent = broker.constructEvent(eventTypes.adminEvents.testEvent, scooterInfo[i]);
              //    broker.publish(newEvent);
              //}

            }, 3000);

            // Save interval id to be able to remove it later
            intervals[i] = drive;
            // Drive scooter using events to steer it + report while driving?
            // Simulate a number of scooters and report while driving
          }
        });

        /**
         * Lock scooter
         */
        broker.onEvent(eventTypes.returnScooterEvents.lockScooter, (e) => {
          if (scooters[i].scooterId === e.data.scooterId) {
            const logRideFinished = Object.assign(logs[i], { end: new Date() });
            lockScooter(scooters[i], e.data.status, e.data.userId, logRideFinished);
            console.log(scooters[i]);
            
            // Remove report-while-driving interval
            clearInterval(intervals[i]);
          }
          
          

          

        })
        

      }


    });
  });
  
} 





main();





