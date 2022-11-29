
// Local
//const { MessageBroker } = require('../../shared/mq');
//const { host, eventTypes } = require('../../shared/resources');

// Docker
const { MessageBroker } = require('./shared/mq');
const { host, eventTypes } = require('./shared/resources');


const main = async () => {
    const broker = await new MessageBroker(host, 'system', 'scooter_service');

    console.log("Scooter service running...");

    broker.onEvent(eventTypes.adminEvents.testEvent, async (e) => {
        const newEvent = broker.constructEvent(eventTypes.adminEvents.getData2, { data: "data" });
        await broker.publish(newEvent);
    })
}

main();




