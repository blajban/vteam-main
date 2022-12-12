const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes } = require('../../shared/resources');

const rpcdum = async () => {
    const broker = await new MessageBroker(host, 'dummyBroker');
    const a = broker.constructEvent(eventTypes.rpcEvents.getParkingSpots, {location: "stockholm"});
    broker.request(a, async(res) => {
        console.log( res)
    })

    const d = broker.constructEvent(eventTypes.rpcEvents.updateParkingSpot, {
        location: "stockholm",
        object: {
            _id: '6397438a57ae0d246f0127f0',
            parkingId: 18,
            properties: { lat: 59.34214241843199, lng: 18.057390907092845 },
            charging: true,
            rate: 'd'
          }
        });
    broker.request(d, async(res) => {
        console.log( res)
    })

    broker.request(a, async(res) => {
        console.log( res)
    })


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