const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes } = require('../../shared/resources');
const ratesHandler = require("./models/ratesHandler")
const locationHandler = require("./models/locationHandler")



const locationService = async () => {
    // Temp
    const data2 = {
      rate: '21242'
    };

    const broker = await new MessageBroker(host, 'location_service');

    // scooterEvents
    broker.onEvent(eventTypes.returnScooterEvents.lockScooter, (e) => {
        let rate = ratesHandler.getRates()
        const newEvent = broker.constructEvent(eventTypes.returnScooterEvents.establishParkingRate,{Price: rate});
        broker.publish(newEvent);
    });


    // RPC
    broker.response(eventTypes.rpcEvents.getParkingSpots, (e) => {
      return locationHandler.getLocations(e.data);
    });

    broker.response(eventTypes.rpcEvents.getChargingStations, (e) => {
      return locationHandler.getChargingStations(e.data);
    });

    broker.response(eventTypes.rpcEvents.getRates, (e) => {
      return data2;
    });

}

locationService();

module.exports = locationService;
