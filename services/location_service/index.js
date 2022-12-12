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
     *  Listen on event lockScooter
     *  and creates new event establishParkingRate
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
     * @param {string} eventType - The type of event to handle.
     * @param {function} handler - The function to handle the event.
     * @returns {function}
     */
    broker.response(eventTypes.rpcEvents.getParkingSpots, async (e) => {
      return await locationHandler.getLocations(mongoWrapper, e.data);
    });

     /**
     * Registers a response to updateParkingSpot event.
     *
     * @param {string} eventType - The type of event to handle.
     * @param {function} handler - The function to handle the event.
     * @returns {function}
     */
    broker.response(eventTypes.rpcEvents.updateParkingSpot, async (e) => {
      return await locationHandler.adjustLocation(mongoWrapper, e.data);
    });

     /**
     * Registers a response to addParkingSpot event.
     *
     * @param {string} eventType - The type of event to handle.
     * @param {function} handler - The function to handle the event.
     * @returns {function}
     */
    broker.response(eventTypes.rpcEvents.addParkingSpot, async (e) => {
      return await locationHandler.insertLocation(mongoWrapper, e.data);
    });

    /**
     * Registers a response to removeParkingSpot event.
     *
     * @param {string} eventType - The type of event to handle.
     * @param {function} handler - The function to handle the event.
     * @returns {function}
     */
    broker.response(eventTypes.rpcEvents.removeParkingSpot, async (e) => {
      return await locationHandler.deleteLocation(mongoWrapper, e.data);
    });



     /**
     * Registers a response to getRates event.
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
     * @param {string} eventType - The type of event to handle.
     * @param {function} handler - The function to handle the event.
     * @returns {function}
     */
    broker.response(eventTypes.rpcEvents.updateRate, async (e) => {
      return await ratesHandler.adjustRate(mongoWrapper, e.data);
    });

    /**
     * Registers a response to addRates event.
     *
     * @param {string} eventType - The type of event to handle.
     * @param {function} handler - The function to handle the event.
     * @returns {function}
     */
    broker.response(eventTypes.rpcEvents.addRate, async (e) => {
      console.log(e)
      return await ratesHandler.insertRate(mongoWrapper, e.data);
    });

    /**
     * Registers a response to removeRate event.
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
