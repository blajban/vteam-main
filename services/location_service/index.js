const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes } = require('../../shared/resources');
const ratesHandler = require("./models/ratesHandler")
const locationHandler = require("./models/locationHandler");
const { mongowrapper } = require('../../shared/mongowrapper');



/**
 *  Locationservice
 *  Handles
 *  Events and RPC-calls when it comes to:
 *  Parkingspots/Chargingspots
 *  Rates
 */



const locationService = async () => {

    const broker = await new MessageBroker(host, 'location_service');
    const mongoWrapper = new mongowrapper();
    await mongoWrapper.connectClient();


    /**
     *  Listen on event lockScooter
     *  and creates new event establishParkingRate
     */
    broker.onEvent(eventTypes.returnScooterEvents.lockScooter, (e) => {
        let rate = ratesHandler.getRates()
        const newEvent = broker.constructEvent(eventTypes.returnScooterEvents.establishParkingRate,{Price: rate});
        broker.publish(newEvent);
    });


    /**
     *  Get locations
     *  @returns {Array}  Array of objects(Locations)
     */
    broker.response(eventTypes.rpcEvents.getParkingSpots, async (e) => {
      console.log(await locationHandler.getLocations(mongoWrapper, e.data))
      return await locationHandler.getLocations(mongoWrapper, e.data);
    });

    /**
     *  Get Chargingsstations
     *  @returns {Array}  Array of objects(Chargingsstations)

    broker.response(eventTypes.rpcEvents.getChargingStations, (e) => {
      return locationHandler.getChargingStations(e.data);
    });
    */
    /**
     * TODO
     *  adjust Parkingspot
     *  @returns {Array}  Array of objects(Rates)
     */
    broker.response(eventTypes.rpcEvents.adjustParkingspot, async (e) => {
      return await locationHandler.adjustLocations(mongoWrapper, e.data);
    });

    /**
     * TODO ??
     *  insert Parkingspot
     *  @returns {Array}  Array of objects(Rates)
     */
    broker.response(eventTypes.rpcEvents.insertParkingspot, async (e) => {
      return await locationHandler.insertLocations(mongoWrapper, e.data);
    });

    /**
     * Registers a response handler for a specific event type.
     *
     * @param {string} eventType - The type of event to handle.
     * @param {function} handler - The function to handle the event.
     * @returns {undefined}
     */
    broker.response(eventTypes.rpcEvents.removeParkingSpot, async (e) => {
      return await locationHandler.insertLocations(mongoWrapper, e.data);
    });

    /**
     *  Get Rates
     *  @returns {Array}  Array of objects(Rates)
     */
    broker.response(eventTypes.rpcEvents.getRates, async (e) => {
      return await ratesHandler.getRates(mongoWrapper, e.data);
    });

    /**
     *  TODO
     *  Adjust Rate
     *  @returns {Array}  Array of objects(Rates)
     */
    broker.response(eventTypes.rpcEvents.adjustRates, async (e) => {
      return await ratesHandler.adjustRate(mongoWrapper, e.data);
    });

    /**
     *  TODO
     *  insert Rate
     *  @returns {Array}  Array of objects(Rates)
     */
    broker.response(eventTypes.rpcEvents.insertRate, async (e) => {
      return await ratesHandler.insertRate(mongoWrapper, e.data);
    });

}

locationService();

module.exports = locationService;
