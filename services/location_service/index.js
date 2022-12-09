const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes } = require('../../shared/resources');
const ratesHandler = require("./models/ratesHandler")
const locationHandler = require("./models/locationHandler");



/**
 *  Locationservice
 *  Handles
 *  Events and RPC-calls when it comes to:
 *  Parkingspots/Chargingspots
 *  Rates
 */



const locationService = async () => {

    const broker = await new MessageBroker(host, 'location_service');

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
      return locationHandler.getLocations(await e.data);
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
    broker.response(eventTypes.rpcEvents.adjustParkingspot, (e) => {
      return locationHandler.adjustLocations(e.data);
    });

    /**
     * TODO ??
     *  insert Parkingspot
     *  @returns {Array}  Array of objects(Rates)
     */
    broker.response(eventTypes.rpcEvents.insertParkingspot, (e) => {
      return locationHandler.insertLocations(e.data);
    });

    /**
     *  Get Rates
     *  @returns {Array}  Array of objects(Rates)
     */
    broker.response(eventTypes.rpcEvents.getRates, (e) => {
      return ratesHandler.getRates(e.data);
    });

    /**
     *  TODO
     *  Adjust Rate
     *  @returns {Array}  Array of objects(Rates)
     */
    broker.response(eventTypes.rpcEvents.adjustRates, (e) => {
      return ratesHandler.adjustRate(e.data);
    });

    /**
     *  TODO
     *  insert Rate
     *  @returns {Array}  Array of objects(Rates)
     */
    broker.response(eventTypes.rpcEvents.insertRate, (e) => {
      return ratesHandler.insertRate(e.data);
    });

}

locationService();

module.exports = locationService;
