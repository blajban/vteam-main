const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes, exchanges } = require('../../shared/resources');

const rpcdum = async () => {
    const broker = await new MessageBroker(host, exchanges.system, 'dummyBroker');

    const e = broker.constructEvent(eventTypes.rpcEvents.getParkingSpots, { city: "stockholm" });
    broker.request(e, (res) => {
        console.log(res)
    })

    const ev = broker.constructEvent(eventTypes.rpcEvents.getChargingStations, { city: "stockholm" });
    broker.request(ev, (res) => {
        console.log(res)
    })
}

rpcdum();