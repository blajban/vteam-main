const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes } = require('../../shared/resources');
const RatesHandler = require("./models/ratesHandler")
const LocationHandler = require("./models/locationHandler");
const { MongoWrapper } = require('../../shared/mongowrapper');
const haversine = require('haversine-distance')



/**
 *  Locationservice
 *  Handles
 *  Events and RPC-calls when it comes to:
 *  Parkingspots/Chargingspots
 *  Rates
 */



const locationService = async () => {

    const broker = await new MessageBroker(host, 'location_service');
    const mongoWrapper = await new MongoWrapper("locations");
    const locationHandler = await new LocationHandler();
    const ratesHandler = await new RatesHandler();


    /**
     * Listen on lockScooter event.
     * Creates establishParkingRate event
     *
     * @param {string} eventType - The type of event to handle.
     * @param {function} handler - fetches rates and filters on rate input.
     * @returns {function} - Publishes establishParkingRate event with filtered Rate
     */
    broker.onEvent(eventTypes.returnScooterEvents.lockScooter, async (e) => {
        let locations = await locationHandler.getLocations(mongoWrapper, e.data.properties)
        let rate = locations.map((k) => {
          let distanceInMeter = haversine({lat:e.data.properties.lat, lng:e.data.properties.lng}, {lat:k.properties.lat, lng: k.properties.lng})
          if(distanceInMeter < 30){
            return k.rate
          }
        })
        rate = rate.filter(item => item);
        if(!rate[0]){
          let rates = await ratesHandler.getRates(mongoWrapper);
          rate = rates.filter((e) => e.id == "d")
        }
        let data = {rate: rate[0], userId: e.data.userId}
        console.log(data)
        const newEvent = broker.constructEvent(eventTypes.returnScooterEvents.establishParkingRate, data);
        broker.publish(newEvent);
    });


     /**
     * Registers a response to getParkingSpots event.
     *
     *
     * @param {string} eventType - Listen on getParkingSpots rpc-call.
     * @param {function} handler - The function to handle the event.
     * @returns {function}  - Runs getLocations
     */
    broker.response(eventTypes.rpcEvents.getParkingSpots, async (e) => {
      return await locationHandler.getLocations(mongoWrapper, e.data);
    });

     /**
     * Registers a response to updateParkingSpot event.
     *
     *
     * @param {string} eventType - Listen on updateParkingSpot rpc-call.
     * @param {function} handler - .
     * @returns {function}  - Runs adjustLocation
     */
    broker.response(eventTypes.rpcEvents.updateParkingSpot, async (e) => {
      return await locationHandler.adjustLocation(mongoWrapper, e.data);
    });

     /**
     * Registers a response to addParkingSpot event.
     *
     *
     * @param {string} eventType - Listen on addParkingSpot rpc-call.
     * @param {function} handler - The function to handle the event.
     * @returns {function}  - runs insertLocation
     */
    broker.response(eventTypes.rpcEvents.addParkingSpot, async (e) => {

      return await locationHandler.insertLocation(mongoWrapper, e.data);
    });

    /**
     * Registers a response to removeParkingSpot event.
     *
     *
     * @param {string} eventType - Listen on removeParkingSpot rpc-call.
     * @param {function} handler - The function to handle the event.
     * @returns {function}  - Runs deleteLocation
     */
    broker.response(eventTypes.rpcEvents.removeParkingSpot, async (e) => {
      return await locationHandler.deleteLocation(mongoWrapper, e.data);
    });



     /**
     * Registers a response to getRates event.
     *
     *
     * @param {string} eventType - The type of event to handle.
     * @param {function} handler - The function to handle the event.
     * @returns {function}
     */
    broker.response(eventTypes.rpcEvents.getRates, async (e) => {
      return await ratesHandler.getRates(mongoWrapper, e.data);
    });

    /**
     * Registers a response to updateRate event.
     *
     *
     * @param {string} eventType - The type of event to handle.
     * @param {function} handler - The function to handle the event.
     * @returns {function}
     */
    broker.response(eventTypes.rpcEvents.updateRate, async (e) => {
      return await ratesHandler.adjustRate(mongoWrapper, e.data);
    });

    /**
     * Registers a response to addRate event.
     *
     *
     * @param {string} eventType - The type of event to handle.
     * @param {function} handler - The function to handle the event.
     * @returns {function}
     */
    broker.response(eventTypes.rpcEvents.addRate, async (e) => {
      return await ratesHandler.insertRate(mongoWrapper, e.data);
    });

    /**
     * Registers a response to removeRate event.
     *
     *
     * @param {string} eventType - The type of event to handle.
     * @param {function} handler - The function to handle the event.
     * @returns {function}
     */
    broker.response(eventTypes.rpcEvents.removeRate, async (e) => {
      return await ratesHandler.deleteRate(mongoWrapper, e.data);
    });

}

locationService();

module.exports = locationService;
