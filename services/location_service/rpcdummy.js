const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes } = require('../../shared/resources');

const rpcdum = async () => {


    /*
    const broker = await new MessageBroker(host, 'dummyBroker');

    const b = broker.constructEvent(eventTypes.rpcEvents.removeParkingSpot, {location: "malmo",
        object: {
            _id: "639760bf4b86a3674b421bf1"
        }});
    broker.request(b, async(res) => {
        console.log( res)
    })

    const a = broker.constructEvent(eventTypes.rpcEvents.getParkingSpots, {location: "malmo"});
    broker.request(a, async(res) => {
        console.log( res)
    })
    */

    //const e = broker.constructEvent(eventTypes.rpcEvents.updateParkingSpot, {
    //location: "stockholm",
    //_id:{ _id: "63973d5031e76e4a784fa375"} ,
    //update: {parkingId: 18}
    //});
    //broker.request(e, async(res) => {
    //    console.log( res)
    //})

}

rpcdum();