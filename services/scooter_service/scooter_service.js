
const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes, exchanges } = require('../../shared/resources');


/**
 * Main function to set up event flow. Listens for events and sends events with the correct data.
 */
const scooterService = async () => {

    const systemBroker = await new MessageBroker(host, exchanges.system, 'scooter_service');
    const scooterBroker = await new MessageBroker(host, exchanges.scooters, 'scooter_service');
    const scooterManager = new ScooterManager();

    systemBroker.onEvent(eventTypes.rentScooterEvents.rentScooter, (e) => {
        const data = scooterManager.unlockScooter(5);
        const newEvent = scooterBroker.constructEvent(eventTypes.rentScooterEvents.unlockScooter, data);
        scooterBroker.publish(newEvent);
    });

    scooterBroker.onEvent(eventTypes.rentScooterEvents.scooterUnlocked, (e) => {
        const newEvent = systemBroker.constructEvent(eventTypes.rentScooterEvents.rideStarted, data);
        systemBroker.publish(newEvent);
    });

    // Scooters reporting
    scooterBroker.onEvent(eventTypes.scooterEvents.scooterIdleReporting, (e) => {
        scooterManager.updateScooter({ long: "4343", lat: "3232"});
        console.log("Scooter reported!");
    })

    scooterBroker.onEvent(eventTypes.scooterEvents.scooterMoving, (e) => {
        console.log("Got report from a moving scooter");
    })

    scooterBroker.onEvent(eventTypes.scooterEvents.batteryLow, (e) => {
        console.log("Scooter reported low battery!");
    })

    // Locking scooter
    systemBroker.onEvent(eventTypes.returnScooterEvents.parkScooter, (e) => {
        const newEvent = scooterBroker.constructEvent(eventTypes.returnScooterEvents.lockScooter, data);
        scooterBroker.publish(newEvent);
    });

    scooterBroker.onEvent(eventTypes.returnScooterEvents.scooterLocked, (e) => {
        const newEvent = systemBroker.constructEvent(eventTypes.returnScooterEvents.rideFinished, data);
        systemBroker.publish(newEvent);
    });

    // Admin events
    systemBroker.onEvent(eventTypes.adminEvents.moveScooter, (e) => {
        console.log("Admin decided to move a scooter!");
    });

    // RPC
    systemBroker.response(eventTypes.rpcEvents.getScooters, (e) => {
        return data;
    });


}


class ScooterManager {
    constructor() {
        console.log("Scooter manager initialized!");
        this.data = {
            scooterId: 1
        };
    }
    
    unlockScooter(scooterId) {
        console.log("Scooter manager unlocked scooter!");
        this.data.scooterId = scooterId;
        return this.data;
    }

    updateScooter(report) {
        console.log(`Update db with ${JSON.stringify(report)}`);
    }
}


scooterService();

module.exports = { ScooterManager };