const { MessageBroker } = require('../../shared/mq')
const { host, eventTypes } = require('../../shared/resources');
const mesBroker = new MessageBroker(host, "gateway");

exports.getParkingspots = async (req, res) => {
    const broker = await mesBroker;
    const newEvent = broker.constructEvent(eventTypes.rpcEvents.getParkingSpots, {city: req.params.city});
    broker.request(newEvent, (e) => {
        res.json(e);
    })
    console.log(req.params.city);

}

exports.getScooters = async (req, res) => {
    const broker = await mesBroker;
    const newEvent = broker.constructEvent(eventTypes.rpcEvents.getScooters, { location: req.params.city });
    broker.request(newEvent, (e) => {
        res.json(e);
    })
}