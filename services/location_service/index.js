const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes, exchanges } = require('../../shared/resources');



const locationService = async () => {
    // Temp
    const data = {
        rate: 100
    };
    const data1 = {
      rate: '21232'
    };
    const data2 = {
      rate: '21242'
    };

    const broker = await new MessageBroker(host, exchanges.scooters, 'location_service');

    // scooterEvents
    broker.onEvent(eventTypes.returnScooterEvents.lockScooter, (e) => {
        console.log("Tar emot lockScooter event, Skapar nytt event")
        const newEvent = broker.constructEvent(eventTypes.returnScooterEvents.establishParkingRate, data);
        console.log(newEvent)
        broker.publish(newEvent);
    });


    // RPC
    broker.response(eventTypes.rpcEvents.getParkingSpots, (e) => {
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
