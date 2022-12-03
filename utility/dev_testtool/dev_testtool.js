const { exchanges, eventTypes } = require('../../shared/resources');
const { MessageBroker } = require('../../shared/mq');


const main = async () => {
    if (x == "-h" || x == "--help") {
        console.log("Usage: [exchange] [eventType]")
        console.log("Available exchanges:");
        console.log(exchanges);
        console.log("Available event types:");
        console.log(eventTypes);
        console.log("Data in the form of {data:\"data\"");
    } else if ((t in eventTypes.accountEvents || t in eventTypes.rentScooterEvents ||
        t in eventTypes.scooterEvents || t in eventTypes.returnScooterEvents || t in eventTypes.rpcEvents ||
        t in eventTypes.paymentEvents || t in eventTypes.adminEvents || t in eventTypes) && x in exchanges) {
            const broker = await new MessageBroker(host, x, serviceName);
            const newEvent = broker.constructEvent(t, data);
            broker.publish(newEvent);
            console.log(`Sent '${t}' to '${x}' exchange with '${data}'`);
    } else {
        console.log("Unrecognised options. Usage: [exchange] [eventType]. -h or --help for help.");
    }

    setTimeout(function() {
        process.exit(0);
    }, 500);
  
}

const host = 'amqp://localhost';
const x = process.argv[2] || exchanges.system;
const t = process.argv[3] || eventTypes.testEvents.testEvent;
const data = process.argv[4] || {};

console.log(JSON.parse(data));

const serviceName = "dev_testtool";

  
main();



