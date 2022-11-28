#!/usr/bin/env node

const { MessageBroker } = require('./shared/mq');
const { host, exchanges, eventTypes } = require('./shared/resources');

const log = [];
let counter = 0;
function printLog(event) {
  const entry = `${counter}: ${event.eventType}-event from ${event.origin}: ${JSON.stringify(event.data)}`
  console.log(entry);
  log.push(event);
  counter++;
}

const f = async () => {
    const broker = await new MessageBroker(host, exchanges.system, "logger");

    for (const x in exchanges) {
        broker.onAllEvents((e) => {
            printLog(e);
        }, x);
    }

    await broker.response(eventTypes.adminEvents.getLog, (req) => {
        return log;
    });

    console.log("Waiting for messages...");
  
}



f();




