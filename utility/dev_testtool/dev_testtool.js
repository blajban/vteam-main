const { eventTypes } = require('../../shared/resources');
const { MessageBroker } = require('../../shared/mq');


const main = async () => {
    if (t == "-h" || t == "--help") {
        console.log("Usage: [eventType]")
        console.log("Available event types:");
        console.log(eventTypes);
        console.log("Data in the form of {data:\"data\"");
    } else if ((t in eventTypes.accountEvents || t in eventTypes.rentScooterEvents ||
        t in eventTypes.scooterEvents || t in eventTypes.returnScooterEvents || t in eventTypes.rpcEvents ||
        t in eventTypes.paymentEvents || t in eventTypes.adminEvents || t in eventTypes)) {
            const broker = await new MessageBroker(host, serviceName);
            const newEvent = broker.constructEvent(t, data);
            broker.publish(newEvent);
            console.log(`Sent '${t}' with '${data}'`);
    } else {
        console.log("Unrecognised options. Usage: [eventType]. -h or --help for help.");
    }

    setTimeout(function() {
        process.exit(0);
    }, 500);
  
}

const host = 'amqp://localhost';
const t = process.argv[2] || eventTypes.testEvents.testEvent;
const data = process.argv[3] || {};

console.log(JSON.parse(data));

const serviceName = "dev_testtool";

  
main();



