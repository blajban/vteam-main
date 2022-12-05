const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes } = require('../../shared/resources');

const log = [];
let counter = 0;
function printLog(event) {
  const entry = `${counter}: ${event.eventType}-event from ${event.origin}: ${JSON.stringify(event.data)}`
  console.log(entry);
  log.push(event);
  counter++;
}

const f = async () => {
    const broker = await new MessageBroker(host, "logger");


    broker.onAllEvents((e) => {
        printLog(e);
    });


    await broker.response(eventTypes.adminEvents.getLog, (req) => {
        return log;
    });

    console.log("Waiting for messages...");
  
}



f();



