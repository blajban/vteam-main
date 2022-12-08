const { MessageBroker } = require('../../shared/mq')
const { host, eventTypes } = require('../../shared/resources');
const mesBroker = new MessageBroker(host, "gateway");

const success = (description, content) => {
    return {
        code: "200",
        description: description,
        content: content
    };
}

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

exports.addScooter = async (req, res) => {
    const newScooter = {
        lng: parseFloat(req.body.lng),
        lat: parseFloat(req.body.lat),
        location: req.params.city
    };

    const broker = await mesBroker;
    const addScooterEvent = broker.constructEvent(eventTypes.rpcEvents.addScooter, newScooter);

    broker.request(addScooterEvent, (e) => {
        res.json(success("Scooter added", e));
    })

    
}

exports.updateScooter = async (req, res) => {
    const scooterToUpdate = {
        scooterId: parseInt(req.params.scooterId)
    };

    if (req.body.hasOwnProperty('status')) {
        scooterToUpdate.status = req.body.status;
    }
    if (req.body.hasOwnProperty('location')) {
        scooterToUpdate.location = req.body.location;
    }
    if (req.body.hasOwnProperty('lat')) {
        scooterToUpdate.lat = parseFloat(req.body.lat);
    }
    if (req.body.hasOwnProperty('lng')) {
        scooterToUpdate.lng = parseFloat(req.body.lng);
    }
    

    const broker = await mesBroker;
    const updateScooterEvent = broker.constructEvent(eventTypes.rpcEvents.updateScooter, scooterToUpdate);

    broker.request(updateScooterEvent, (e) => {
        res.json(success("Updated scooter", e))
    })

}

exports.removeScooter = async (req, res) => {
    const broker = await mesBroker;
    const removeScooterEvent = broker.constructEvent(eventTypes.rpcEvents.removeScooter, {
        scooterId: parseInt(req.params.scooterId)
    });
    broker.request(removeScooterEvent, (e) => {
        res.json(success("Removed scooter", e));
    })
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

exports.addParkingspot = async (req, res) => {
    //TODO
    const newParkingSpot = {};

    const broker = await mesBroker;
    const addParkingspotEvent = broker.constructEvent(eventTypes.rpcEvents.addParkingspot, newParkingSpot);

    broker.request(addParkingspotEvent, (e) => {
        res.json(success("Parkingspot added", e));
    })
}

exports.updateParkingspot = async (req, res) => {
    // TODO
    const parkingspotToUpdate = {};
    

    const broker = await mesBroker;
    const updateParkingspotEvent = broker.constructEvent(eventTypes.rpcEvents.updateParkingspot, parkingspotToUpdate);

    broker.request(updateParkingspotEvent, (e) => {
        res.json(success("Updated parkingspot", e))
    })
}

exports.removeParkingspot = async (req, res) => {
    // TODO
    const broker = await mesBroker;
    const removeParkingspotEvent = broker.constructEvent(eventTypes.rpcEvents.removeParkingspot, {
        parkingId: parseInt(req.params.parkingId)
    });
    broker.request(removeParkingspotEvent, (e) => {
        res.json(success("Removed parkingspot", e));
    })
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

exports.addChargingStation = async (req, res) => {
    // TODO
    const newChargingStation = {};

    const broker = await mesBroker;
    const addChargingStationEvent = broker.constructEvent(eventTypes.rpcEvents.addChargingStation, newChargingStation);

    broker.request(addChargingStationEvent, (e) => {
        res.json(success("Charging station added", e));
    })
}

exports.updateChargingStation = async (req, res) => {
    // TODO
    const chargingStationToUpdate = {};
    

    const broker = await mesBroker;
    const updateChargingStationEvent = broker.constructEvent(eventTypes.rpcEvents.updateChargingStation, chargingStationToUpdate);

    broker.request(updateChargingStationEvent, (e) => {
        res.json(success("Updated sharging station", e));
    })
}

exports.removeChargingStation = async (req, res) => {
    // TODO
    const broker = await mesBroker;
    const removeChargingStationEvent = broker.constructEvent(eventTypes.rpcEvents.removeChargingStation, {
        chargingId: parseInt(req.params.chargingId)
    });
    broker.request(removeChargingStationEvent, (e) => {
        res.json(success("Removed charging station", e));
    })
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

exports.addUser = async (req, res) => {
    // TODO
    const newUser = {};

    const broker = await mesBroker;
    const addUserEvent = broker.constructEvent(eventTypes.rpcEvents.addUser, newUser);

    broker.request(addUserEvent, (e) => {
        res.json(success("User added", e));
    })
}

exports.updateUser = async (req, res) => {
    // TODO
    const userToUpdate = {};
    

    const broker = await mesBroker;
    const updateUserEvent = broker.constructEvent(eventTypes.rpcEvents.updateUser, userToUpdate);

    broker.request(updateUserEvent, (e) => {
        res.json(success("Updated user", e));
    })
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