const { MessageBroker } = require('../../shared/mq')
const { host, eventTypes } = require('../../shared/resources');
const mesBroker = new MessageBroker(host, "gateway");

exports.getCities = async (req, res) => {

    // Temp!

    let result = [];
    if (req.params.hasOwnProperty('city')) {
        result.push({
            city: req.params.city
        })
    }
    
    result.push({
        data: "data!"
    });
    
    res.json(result);
}

exports.updateCities = async (req, res) => {
    // TODO
    console.log(req);
    res.json("TODO");
}

exports.getScooters = async (req, res) => {
    const filter = {
        location: req.params.city
    };

    
    if (req.params.hasOwnProperty('scooterId')) {
        filter.scooterId = parseInt(req.params.scooterId)
    }

    const broker = await mesBroker;
    const getScootersEvent = broker.constructEvent(eventTypes.rpcEvents.getScooters, filter);
    broker.request(getScootersEvent, (e) => {
        res.json(e);
    })
}

exports.addScooters = async (req, res) => {
    // TODO
    console.log(req);
    res.json("TODO");
}

exports.updateScooters = async (req, res) => {
    // TODO
    console.log(req);
    res.json("TODO");
}

exports.removeScooters = async (req, res) => {
    // TODO
    console.log(req);
    res.json("TODO");
}


exports.getParkingspots = async (req, res) => {
    const filter = {
        location: req.params.city
    };

    
    if (req.params.hasOwnProperty('parkingId')) {
        filter.parkingId = parseInt(req.params.parkingId)
    }

    const broker = await mesBroker;
    const getParkingSpotsEvent = broker.constructEvent(eventTypes.rpcEvents.getParkingSpots, filter);
    broker.request(getParkingSpotsEvent, (e) => {
        res.json(e);
    })
}

exports.addParkingspots = async (req, res) => {
    //TODO
    console.log(req);
    res.json("TODO");
}

exports.updateParkingspots = async (req, res) => {
    // TODO
    console.log(req);
    res.json("TODO");
}

exports.removeParkingspots = async (req, res) => {
    // TODO
    console.log(req);
    res.json("TODO");
}

exports.getChargingStations = async (req, res) => {
    const filter = {
        location: req.params.chargingId
    };

    
    if (req.params.hasOwnProperty('chargingId')) {
        filter.chargingId = parseInt(req.params.chargingId)
    }

    const broker = await mesBroker;
    const getChargingStationEvent = broker.constructEvent(eventTypes.rpcEvents.getChargingStations, filter);
    broker.request(getChargingStationEvent, (e) => {
        res.json(e);
    })

}

exports.addChargingStations = async (req, res) => {
    // TODO
    console.log(req);
    res.json("TODO");
}

exports.updateChargingStations = async (req, res) => {
    // TODO
    console.log(req);
    res.json("TODO");
}

exports.removeChargingStations = async (req, res) => {
    // TODO
    console.log(req);
    res.json("TODO");
}

exports.getUsers = async (req, res) => {
    const filter = {};

    
    if (req.params.hasOwnProperty('userId')) {
        filter.userId = parseInt(req.params.userId)
    }

    const broker = await mesBroker;
    const getUsersEvent = broker.constructEvent(eventTypes.rpcEvents.getUsers, filter);
    broker.request(getUsersEvent, (e) => {
        res.json(e);
    })
}

exports.addUsers = async (req, res) => {
    // TODO
    console.log(req);
    res.json("TODO");
}

exports.updateUsers = async (req, res) => {
    // TODO
    console.log(req);
    res.json("TODO");
}

exports.removeUsers = async (req, res) => {
    // TODO
    console.log(req);
    res.json("TODO");
}

exports.adminLogin = async (req, res) => {
    // TODO
    console.log(req);
    res.json("TODO");
}

exports.login = async (req, res) => {
    // TODO
    console.log(req);
    res.json("TODO");
}

exports.logout = async (req, res) => {
    // TODO
    console.log(req);
    res.json("TODO");
}

exports.addInvoice = async (req, res) => {
    // TODO
    console.log(req);
    res.json("TODO");
}

exports.getUserInvoices = async (req, res) => {
    // TODO
    console.log(req);
    res.json("TODO");
}

exports.getInvoice = async (req, res) => {
    // TODO
    console.log(req);
    res.json("TODO");
}

exports.getRates = async (req, res) => {
    // TODO
    console.log(req);
    res.json("TODO");
}

exports.addRates = async (req, res) => {
    // TODO
    console.log(req);
    res.json("TODO");
}

exports.updateRates = async (req, res) => {
    // TODO
    console.log(req);
    res.json("TODO");
}

exports.removeRates = async (req, res) => {
    // TODO
    console.log(req);
    res.json("TODO");
}