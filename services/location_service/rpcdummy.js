const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes } = require('../../shared/resources');

const rpcdum = async () => {
    const broker = await new MessageBroker(host, 'dummyBroker');

    const e = broker.constructEvent(eventTypes.rpcEvents.getParkingSpots, {location: "malmo"});
    broker.request(e, async (res) => {
        console.log(res)
    })

    /**const ev = broker.constructEvent(eventTypes.rpcEvents.getChargingStations, {});
    broker.request(ev, (res) => {
        console.log(res)
    })
    */
}

rpcdum();