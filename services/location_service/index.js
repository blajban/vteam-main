const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes } = require('../../shared/resources');
const ratesHandler = require("./models/ratesHandler")
const locationHandler = require("./models/locationHandler");
const { MongoWrapper } = require('../../shared/mongowrapper');



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


    /**
     * Listen on lockScooter event.
     * Creates establishParkingRate event
     *
     * @param {string} eventType - The type of event to handle.
     * @param {function} handler - fetches rates and filters on rate input.
     * @returns {function} - Publishes establishParkingRate event with filtered Rate
     */
    broker.onEvent(eventTypes.returnScooterEvents.lockScooter, async (e) => {
        let rate = await ratesHandler.getRates(mongoWrapper, "rates")
        const rightRate = rate.filter((rate) => {
          if(rate.id == e.rate){
            return rate
          }
        })
        const newEvent = broker.constructEvent(eventTypes.returnScooterEvents.establishParkingRate, rightRate);
        broker.publish(newEvent);
    });


     /**
     * Registers a response to getParkingSpots event.
     *
     * Fetches locations from database
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
     * Updates data in database
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
     * Adds a new location to database
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
     * Removes data from database
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
     * Runs getRates as a callback
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
     * Runs adjustRate as a callback
     *
     * @param {string} eventType - The type of event to handle.
     * @param {function} handler - The function to handle the event.
     * @returns {function}
     */
    broker.response(eventTypes.rpcEvents.updateRate, async (e) => {
      console.log(e)
      return await ratesHandler.adjustRate(mongoWrapper, e.data);
    });

    /**
     * Registers a response to addRate event.
     *
     * runs insertRate as a callback
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
     * runs deleteRate as a callback
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
