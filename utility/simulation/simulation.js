

const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes, exchanges } = require('../../shared/resources');


const main = async () => {

  /**
   * Scooter reporting while idle.
   * @param {Object} scooter 
   */
  const idleReporting = (scooter) => {
    console.log(`Scooter ${scooter.scooterId} reporting!`);
    const newEvent = broker.constructEvent(eventTypes.scooterEvents.scooterIdleReporting, scooter);
    broker.publish(newEvent);
  }

  /**
   * Unlock scooter and update status
   * @param {Object} scooter 
   * @param {number} userId 
   */
  const unlockScooter = (scooter, userId) => {
    scooter.status = "claimed";
    scooter.userId = userId;
    const newEvent = broker.constructEvent(eventTypes.rentScooterEvents.scooterUnlocked, scooter);
    broker.publish(newEvent);
  }

  /**
   * 
   * @param {Object} scooter 
   * @param {Object} startEndTime 
   */
  const lockScooter = (scooter, startEndTime) => {
    scooter.status = "available";
    scooter.userId = 0;
    scooter.log.push(startEndTime);
    const newEvent = broker.constructEvent(eventTypes.returnScooterEvents.scooterLocked, scooter);
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
      const scooters = Object.assign([], res);
      console.log(`Initialised ${scooters.length} scooters from scooter_service...`);

      /**
       * Set eventlisteners and intervals for all scooters
       */
      for (let i = 0; i < scooters.length; i++) {
        setInterval(() => {
            idleReporting(scooters[i]);
        }, 4000);

        /**
         * Set the rest of event listeners in for loop
         */

        /**
         * Unlock scooter
         */
        broker.onEvent(eventTypes.rentScooterEvents.unlockScooter, (e) => {
          // Add if check to see if its the scooter with this id that's being unlocked
          console.log(`Unlocking scooter ${scooters[i].scooterId}`)
          const userId = JSON.parse(e.data).userId;
          unlockScooter(scooters[i], userId);

          // Log start time
          logs[i] = {
            start: new Date()
          };

          // Drive scooter using events to steer it + report while driving?
          // Simulate a number of scooters and report while driving
        });

        /**
         * Lock scooter
         */
        broker.onEvent(eventTypes.returnScooterEvents.lockScooter, (e) => {
          console.log(`Locking scooter ${scooters[i].scooterId}`)
          const rideFinished = Object.assign(logs[i], { end: new Date() });
          lockScooter(scooters[i], logs[i]);

          // Remove report-while-driving interval
          //clearInterval(intervals[i]);

        })
        

      }


    });
  });
  
} 





main();





