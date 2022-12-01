const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes, exchanges } = require('../../shared/resources');
const ratesHandler = require("./models/ratesHandler")



const locationService = async () => {
    // Temp
    const data1 = {
      rate: '21232'
    };
    const data2 = {
      rate: '21242'
    };

    const broker = await new MessageBroker(host, exchanges.scooters, 'location_service');

    // scooterEvents
    broker.onEvent(eventTypes.returnScooterEvents.lockScooter, (e) => {
        console.log("Tar emot lockScooter event, Skapar nytt evente")
        const newEvent = broker.constructEvent(eventTypes.returnScooterEvents.establishParkingRate,{rate:ratesHandler.getRates("a") });
        console.log(newEvent)
        broker.publish(newEvent);
    });


    // RPC
    broker.response(eventTypes.rpcEvents.getParkingSpots, (e) => {
      console.log("hello")
        return data1;
    });

    broker.response(eventTypes.rpcEvents.getChargingStations, (e) => {
      return data2;
    });

    broker.response(eventTypes.rpcEvents.getRates, (e) => {
      return data2;
    });


}

locationService();
