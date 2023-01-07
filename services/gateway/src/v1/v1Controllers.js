const { MessageBroker } = require('../../../../shared/mq')
const { host, eventTypes } = require('../../../../shared/resources');
const mesBroker = new MessageBroker(host, "gateway");

const checkLogin = (broker, req, admin, cb) => {
  const filter = {
      token: req.headers['x-access-token'],
      userId: parseInt(req.params.loginId),
      checkAdmin: admin
  };

  const checkLoginEvent = broker.constructEvent(eventTypes.accountEvents.checkLogin, filter);
  broker.request(checkLoginEvent, cb);
}

/**
 * Formulate a rest answer.
 * @param {string} description
 * @param {object} content
 * @returns
 */
const success = (description, content) => {
    return {
        code: "200",
        description: description,
        content: content
    };
}

/**
 * Rest response when token is not valid.
 * @returns
 */
function notValidToken() {
    return {
        code: "401",
        message: "Token is not valid"
    };
}

/**
 * Rest response when user doesn't have admin rights.
 * @returns
 */
function notAdmin() {
    return {
        code: "402",
        message: "You don't have admin rights"
    }
}

exports.rentScooter = async (req, res) => {
    const data = {
        _id: req.params.scooterId,
        userId: req.params.userId
    }

    const broker = await mesBroker;
    const rentScooterEvent = broker.constructEvent(eventTypes.rentScooterEvents.rentScooter, data);
    await broker.publish(rentScooterEvent);
    res.json(success("Renting scooter", data));
}

exports.parkScooter = async (req, res) => {
    const data = {
        _id: req.params.scooterId
    };

    const broker = await mesBroker;
    const parkScooterEvent = broker.constructEvent(eventTypes.returnScooterEvents.parkScooter, data);
    await broker.publish(parkScooterEvent);
    res.json(success("Parking scooter", data));

}

exports.simulateScooters = async (req, res) => {
    const broker = await mesBroker;
    const startSimulationEvent = broker.constructEvent(eventTypes.adminEvents.simulateScooters, {});
    await broker.publish(startSimulationEvent);
    res.json(success("Simulating scooters", {}));
}

exports.stopSimulation = async (req, res) => {
    const broker = await mesBroker;
    const stopSimulationEvent = broker.constructEvent(eventTypes.adminEvents.stopSimulation, {});
    await broker.publish(stopSimulationEvent);
    res.json(success("Stopping simulation", {}));
}

exports.addRandomScooters = async (req, res) => {
    const data = {
        number: req.params.number,
        location: req.params.city
    }

    const broker = await mesBroker;
    const addRandomScootersEvent = broker.constructEvent(eventTypes.adminEvents.addRandomScooters, data);
    await broker.publish(addRandomScootersEvent);
    res.json(success("Added scooters to system", data));
}

/**
 * Get all scooters in a city or a specific scooter in a city if scooterId is provided.
 * @param {object} req
 * @param {object} res
 */
exports.getScooters = async (req, res) => {
    const filter = {
        location: req.params.city
    };


    if (req.params.hasOwnProperty('scooterId')) {
        filter._id = req.params.scooterId
    }

    const broker = await mesBroker;
    const getScootersEvent = broker.constructEvent(eventTypes.rpcEvents.getScooters, filter);
    broker.request(getScootersEvent, (e) => {
        res.json(e);
    })
}

/**
 * Add scooter to a city.
 * @param {object} req
 * @param {object} res
 */
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

/**
 * Update scooter in a city.
 * @param {object} req
 * @param {object} res
 */
exports.updateScooter = async (req, res) => {
    const scooterToUpdate = {
        _id: req.params.scooterId
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
    if (req.body.hasOwnProperty('battery')) {
        scooterToUpdate.battery = parseInt(req.body.battery);
    }


    const broker = await mesBroker;
    const updateScooterEvent = broker.constructEvent(eventTypes.rpcEvents.updateScooter, scooterToUpdate);

    broker.request(updateScooterEvent, (e) => {
        res.json(success("Updated scooter", e))
    })

}

/**
 * Remove scooter in a city
 * @param {object} req
 * @param {object} res
 */
exports.removeScooter = async (req, res) => {
    const id = {
        _id: req.params.scooterId
    }
    const broker = await mesBroker;
    const removeScooterEvent = broker.constructEvent(eventTypes.rpcEvents.removeScooter, id);
    broker.request(removeScooterEvent, (e) => {
        res.json(success("Removed scooter", e));
    })
}

/**
 * Get parking spots and charging stations in a city
 * @param {object} req
 * @param {object} res
 */
exports.getParkingspots = async (req, res) => {
    const filter = {
        location: req.params.city
    };

    const broker = await mesBroker;
    const getParkingSpotsEvent = broker.constructEvent(eventTypes.rpcEvents.getParkingSpots, filter);
    broker.request(getParkingSpotsEvent, (e) => {
        res.json(e);
    })
}

/**
 * Add parking spot (or charging station) to a city.
 * @param {object} req
 * @param {object} res
 */
exports.addParkingspot = async (req, res) => {
    const newParkingSpot = {
        location: req.body.location,
        object: req.body.object
    };
    console.log(newParkingSpot)
    const broker = await mesBroker;
    const addParkingspotEvent = broker.constructEvent(eventTypes.rpcEvents.addParkingSpot, newParkingSpot);

    broker.request(addParkingspotEvent, (e) => {
        res.json(success("Parkingspot added", e));
    })
}

/**
 * Update parking spot (or charging station) in a city.
 * @param {object} req
 * @param {object} res
 */
exports.updateParkingspot = async (req, res) => {
    const parkingspotToUpdate = {
        location: req.body.location,
        object: req.body.object
    };
    console.log(parkingspotToUpdate)
    const broker = await mesBroker;
    const updateParkingspotEvent = broker.constructEvent(eventTypes.rpcEvents.updateParkingSpot, parkingspotToUpdate);

    broker.request(updateParkingspotEvent, (e) => {
        res.json(success("Updated parkingspot", e))
    })
}

/**
 * Remove parking spot (or charging station) in a city.
 * @param {object} req
 * @param {object} res
 */
exports.removeParkingspot = async (req, res) => {
    const parkingspotToDelete = {
        location: req.body.location,
        object: req.body.object
    };
    const broker = await mesBroker;
    const removeParkingspotEvent = broker.constructEvent(eventTypes.rpcEvents.removeParkingSpot, parkingspotToDelete);
    broker.request(removeParkingspotEvent, (e) => {
        res.json(success("Removed parkingspot", e));
    })
}

/**
 * Get charging stations in a city (parking spots where charging is true)
 * @param {object} req
 * @param {object} res
 */
exports.getChargingStations = async (req, res) => {
    const filter = {
        location: req.params.chargingId
    };

    const broker = await mesBroker;
    const getChargingStationEvent = broker.constructEvent(eventTypes.rpcEvents.getChargingStations, filter);
    broker.request(getChargingStationEvent, (e) => {
        res.json(e);
    })

}

/**
 * Get all users or a specific user if userId is provided.
 * @param {object} req
 * @param {object} res
 */
exports.getUsers = async (req, res) => {
    const broker = await mesBroker;
    checkLogin(broker, req, true, (e) => {
      if (!e.loggedIn) {
        return res.json(notValidToken());
      }

      if (!e.admin) {
        return res.json(notAdmin());
      }

      const filter2 = {};
      if (req.params.hasOwnProperty('userId')) {
        filter2._id = parseInt(req.params.userId);
      }
      const getUsersEvent = broker.constructEvent(eventTypes.rpcEvents.getUsers, filter2);
      broker.request(getUsersEvent, (e) => {
        res.json(e);
      });
    });
}

/**
 * Add user.
 * @param {object} req
 * @param {objec} res
 */
exports.addUser = async (req, res) => {
  const broker = await mesBroker;
  checkLogin(broker, req, true, (e) => {
    if (!e.loggedIn) {
      return res.json(notValidToken());
    }

    if (!e.admin) {
      return res.json(notAdmin());
    }

    const newUser = {
      _id: req.body._id,
      name: req.body.name,
      mobile: req.body.mobile,
      mail: req.body.mail,
      city: req.body.city,
      address: req.body.address,
      zip: req.body.zip,
      balance: parseFloat(req.body.balance)
    };

    if (req.body.admin === 'true') {
        newUser.admin = true;
    } else {
        newUser.admin = false;
    }

    const addUserEvent = broker.constructEvent(eventTypes.rpcEvents.addUser, newUser);

    broker.request(addUserEvent, (e) => {
        res.json(success("User added", e));
    });
  });
}

/**
 * Update user.
 * @param {object} req
 * @param {object} res
 */
exports.updateUser = async (req, res) => {
  const broker = await mesBroker;
  checkLogin(broker, req, true, (e) => {
    if (!e.loggedIn) {
      return res.json(notValidToken());
    }

    if (parseInt(req.params.loginId) !== parseInt(req.params.userId) && !e.admin) {
      return res.json(notAdmin());
    }

    const userToUpdate = {
      _id: parseInt(req.params.userId)
    };

    if (req.body.hasOwnProperty('name')) {
      userToUpdate.name = req.body.name;
    }
    if (req.body.hasOwnProperty('mobile')) {
      userToUpdate.mobile = req.body.mobile;
    }
    if (req.body.hasOwnProperty('mail')) {
      userToUpdate.mail = req.body.mail;
    }
    if (req.body.hasOwnProperty('city')) {
      userToUpdate.city = req.body.city;
    }
    if (req.body.hasOwnProperty('address')) {
      userToUpdate.address = req.body.address;
    }
    if (req.body.hasOwnProperty('zip')) {
      userToUpdate.zip = req.body.zip;
    }
    if (req.body.hasOwnProperty('admin')) {
      if (req.body.admin === 'true') {
          userToUpdate.admin = true;
      } else {
          userToUpdate.admin = false;
      }
    }
    if (req.body.hasOwnProperty('balance')) {
      userToUpdate.balance = parseFloat(req.body.balance);
    }

    const updateUserEvent = broker.constructEvent(eventTypes.rpcEvents.updateUser, userToUpdate);

    broker.request(updateUserEvent, (e) => {
      res.json(success("Updated user", e));
    })
    
  });

}

/**
 * Remove user.
 * @param {object} req
 * @param {object} res
 */
exports.removeUser = async (req, res) => {
  const broker = await mesBroker;
  checkLogin(broker, req, true, (e) => {
    if (!e.loggedIn) {
      return res.json(notValidToken());
    }

    if (!e.admin) {
      return res.json(notAdmin());
    }

    const removeUserEvent = broker.constructEvent(eventTypes.rpcEvents.removeUser, {
      _id: parseInt(req.params.userId)
    });
    broker.request(removeUserEvent, (e) => {
        res.json(success("Removed user", e));
    });
  });
}

/**
 * Get token for user.
 * @param {object} req
 * @param {object} res
 */
exports.getToken = async (req, res) => {
    const broker = await mesBroker;
    const getTokenEvent = broker.constructEvent(eventTypes.accountEvents.getToken, {
        code: req.params.code
    });

    broker.request(getTokenEvent, (e) => {
        res.json(success("Get token success", e));
    });
}

/**
 * Get information about the user from the GitHub API.
 * @param {object} req
 * @param {object} res
 */
exports.getGitHubUser = async (req, res) => {
    const broker = await mesBroker;
    const getGitHubUserEvent = broker.constructEvent(eventTypes.accountEvents.getGitHubUser, {
        token: req.headers['x-access-token']
    });

    broker.request(getGitHubUserEvent, (e) => {
        res.json(success("Get github user success", e));
    });
}

exports.addInvoice = async (req, res) => {
    const newInvoice = req.body.invoice

    const broker = await mesBroker;
    const addInvoiceEvent = broker.constructEvent(eventTypes.rpcEvents.addInvoice, newInvoice);

    broker.request(addInvoiceEvent, (e) => {
        res.json(success("Invoice added", e));
    })
}

/**
 * Get all invoices for a specific user or an invoice with a specific ID.
 * @param {object} req
 * @param {object} res
 */
exports.getInvoices = async (req, res) => {
    const filter = {};

    if (req.params.hasOwnProperty('userId')) {
        filter.userId = req.params.userId;
    }
    if (req.params.hasOwnProperty('invoiceId')) {
        filter.invoiceId = req.params.invoiceId;
    }

    const broker = await mesBroker;
    const getInvoicesEvent = broker.constructEvent(eventTypes.rpcEvents.getInvoices, filter);
    broker.request(getInvoicesEvent, (e) => {
        res.json(e);
    })
}

/**
 * Get all rates or rate with specific id.
 * @param {object} req
 * @param {object} res
 */
exports.getRates = async (req, res) => {
    const filter = {};
    const broker = await mesBroker;
    const getRatesEvent = broker.constructEvent(eventTypes.rpcEvents.getRates, filter);
    broker.request(getRatesEvent, (e) => {
        res.json(e);
    })
}

/**
 * Add rate.
 * @param {object} req
 * @param {object} res
 */
exports.addRate = async (req, res) => {

    const broker = await mesBroker;
    const addRateEvent = broker.constructEvent(eventTypes.rpcEvents.addRate, req.body.newRate);

    broker.request(addRateEvent, (e) => {
        res.json(success("Rate added", e));
    })
}

/**
 * Update rate with specific id.
 * @param {object} req
 * @param {objec} res
 */
exports.updateRate = async (req, res) => {
    const rateToUpdate = {
        _id: req.body._id,
        object: req.body.object
    };
    const broker = await mesBroker;
    const updateRate = broker.constructEvent(eventTypes.rpcEvents.updateRate, rateToUpdate);

    broker.request(updateRate, (e) => {
        res.json(success("Updated rate", e));
    })
}

/**
 * Remove rate with id.
 * @param {object} req
 * @param {object} res
 */
exports.removeRate = async (req, res) => {
    const broker = await mesBroker;
    const removeRateEvent = broker.constructEvent(eventTypes.rpcEvents.removeRate, {
        _id: req.body._id
    });
    broker.request(removeRateEvent, (e) => {
        res.json(success("Removed rate", e));
    })
}