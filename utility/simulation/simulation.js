

const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes, exchanges } = require('../../shared/resources');

/*
const scooterInfo = [
    {
        scooterId: 1,
        status: "available",
        userId: 0,
        location: "stockholm",
        status: {
            lat: "58.58502",
            long: "58.58502",
            speed: "0",
            battery: "100"  
        },
        log: []
    },
    {
        scooterId: 2,
        status: "claimed",
        userId: 5,
        location: "göteborg",
        status: {
            lat: "18.58502",
            long: "18.58502",
            speed: "20",
            battery: "30"  
        },
        log: []
    }
]
*/

const scooterInfo = [];

const addScooters = (numberOfScooters) => {
    // Get this info from scooter_service instead?
    for (let i = 1; i < numberOfScooters; i++) {
        scooterInfo.push({
                scooterId: i,
                status: "available",
                userId: 0,
                location: "stockholm",
                status: {
                    lat: "58.58502",
                    long: "58.58502",
                    speed: "0",
                    battery: "100"  
                },
                log: []
        });
    }
    

}

const simulateDriving = (scooterId) => {
    scooterInfo[scooterId].status.lat++;
    scooterInfo[scooterId].status.long++;
    scooterInfo[scooterId].status.battery--;
}

const outOfBounds = (long, lat) => {
    return false;
}

const f = async () => {
    const intervals = {};
    const logs = {};
    addScooters(100);
    const broker = await new MessageBroker(host, exchanges.scooters, 'simulation');

    for (let i = 0; i < scooterInfo.length; i++) {
        // Scooter idle
        setInterval(() => {
            console.log("reporting!");
            const newEvent = broker.constructEvent(eventTypes.scooterEvents.scooterIdleReporting, scooterInfo[i]);
            broker.publish(newEvent);
        }, 10000);

        // Unlock scooter
        broker.onEvent(eventTypes.rentScooterEvents.unlockScooter, (e) => {
            console.log("Unlocking scooter");
            
            // update scooter status
            scooterInfo.status = "claimed";
            scooterInfo.userId = 5;
            
            // Send event
            const newEvent = broker.constructEvent(eventTypes.rentScooterEvents.scooterUnlocked, scooterInfo[i]);
            broker.publish(newEvent);

            // Log start time
            logs[i] = {
                start: new Date()
            };

            // Report while driving
            const drive = setInterval(() => {
                console.log("driving!!");

                // update scooter status
                simulateDriving(i)

                // Send event
                const newEvent = broker.constructEvent(eventTypes.scooterEvents.scooterMoving, scooterInfo[i]);
                broker.publish(newEvent);

                // Low battery
                if (scooterInfo[i].status.battery < 20) {
                    const newEvent = broker.constructEvent(eventTypes.scooterEvents.batteryLow, scooterInfo[i]);
                    broker.publish(newEvent);
                }

                // Outside boundaries
                if (outOfBounds(scooterInfo[i].status.long, scooterInfo[i].status.lat)) {
                    const newEvent = broker.constructEvent(eventTypes.adminEvents.testEvent, scooterInfo[i]);
                    broker.publish(newEvent);
                }

            }, 3000);

            // Save interval id to be able to remove it later
            intervals[i] = drive;

        })
        
        // Lock scooter
        broker.onEvent(eventTypes.returnScooterEvents.lockScooter, (e) => {
            console.log("Locking scooter!");

            // update status
            scooterInfo[i].status = "available";
            scooterInfo[i].userId = 0;

             // Log end time
            const rideFinished = Object.assign(logs[i], { end: new Date() });
            scooterInfo[i].log.push(rideFinished);

            // Send event
            const newEvent = broker.constructEvent(eventTypes.returnScooterEvents.scooterLocked, scooterInfo[i]);
            console.log(scooterInfo[i]);
            broker.publish(newEvent);

            
            // Remove report-while-driving interval
            clearInterval(intervals[i]);
        })

        // RPC (Add event type to resources)
        broker.response("getScooterInfo", (e) => {
            return scooterInfo[i];
        });
    }

}

f();




