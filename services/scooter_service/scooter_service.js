
// Local
//const { MessageBroker } = require('../../shared/mq');
//const { host, eventTypes } = require('../../shared/resources');

// Docker
const { MessageBroker } = require('./shared/mq');
const { host, eventTypes } = require('./shared/resources');


const main = async () => {
    const broker = await new MessageBroker(host, 'scooters', 'scooter_service');

    console.log("Scooter service running...");

    broker.onEvent(eventTypes.adminEvents.testEvent, (e) => {
        console.log(e);
        const newEvent = broker.constructEvent(eventTypes.adminEvents.getData2, { data: "data" });
        broker.publish(newEvent);
    })
}

main();




