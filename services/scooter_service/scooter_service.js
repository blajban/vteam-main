
const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes, exchanges } = require('../../shared/resources');



const scooterService = async () => {
    // Temp
    const data = {
        scooterId: 1
    };

    const broker = await new MessageBroker(host, exchanges.scooters, 'scooter_service');

    // Unlocking scooter
    broker.onEvent(eventTypes.rentScooterEvents.rentScooter, (e) => {
        const newEvent = broker.constructEvent(eventTypes.rentScooterEvents.unlockScooter, data);
        broker.publish(newEvent);
    });

    broker.onEvent(eventTypes.rentScooterEvents.scooterUnlocked, (e) => {
        const newEvent = broker.constructEvent(eventTypes.rentScooterEvents.rideStarted, data);
        broker.publish(newEvent);
    });

    // Scooters reporting
    broker.onEvent(eventTypes.scooterEvents.scooterIdleReporting, (e) => {
        console.log("Got report from scooter");
    })

    broker.onEvent(eventTypes.scooterEvents.scooterMoving, (e) => {
        console.log("Got report from a moving scooter");
    })

    broker.onEvent(eventTypes.scooterEvents.batteryLow, (e) => {
        console.log("Scooter reported low battery!");
    })

    // Locking scooter
    broker.onEvent(eventTypes.returnScooterEvents.parkScooter, (e) => {
        const newEvent = broker.constructEvent(eventTypes.returnScooterEvents.lockScooter, data);
        broker.publish(newEvent);
    });

    broker.onEvent(eventTypes.returnScooterEvents.scooterLocked, (e) => {
        const newEvent = broker.constructEvent(eventTypes.returnScooterEvents.rideFinished, data);
        broker.publish(newEvent);
    });

    // Admin events
    broker.onEvent(eventTypes.adminEvents.moveScooter, (e) => {
        console.log("Admin decided to move a scooter!");
    });

    // RPC
    broker.response(eventTypes.rpcEvents.getScooters, (e) => {
        return data;
    });


}

scooterService();
