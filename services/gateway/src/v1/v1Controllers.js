const { MessageBroker } = require('../../../../shared/mq');
const { host, eventTypes } = require('../../../../shared/resources');

const mesBroker = new MessageBroker(host, 'gateway');

const checkLogin = (broker, req, admin, cb) => {
  const filter = {
    token: req.headers['x-access-token'],
    userId: parseInt(req.params.loginId),
    checkAdmin: admin,
  };

  const checkLoginEvent = broker.constructEvent(eventTypes.accountEvents.checkLogin, filter);
  broker.request(checkLoginEvent, cb);
};

/**
 * Formulate a rest answer.
 * @param {string} description
 * @param {object} content
 * @returns
 */
const success = (description, content) => {
  return {
    code: '200',
    description: description,
    content: content,
  };
};

/**
 * Rest response when token is not valid.
 * @returns
 */
function notValidToken() {
  return {
    code: '401',
    message: 'Token is not valid',
  };
}

/**
 * Rest response when user doesn't have admin rights.
 * @returns
 */
function notAdmin() {
  return {
    code: '402',
    message: 'You don\'t have admin rights',
  };
}

exports.rentScooter = async (req, res) => {
  const broker = await mesBroker;
  checkLogin(broker, req, false, async (e) => {
    if (!e.loggedIn) {
      return res.json(notValidToken());
    }

    if (!e.admin) {
      return res.json(notAdmin());
    }

    const data = {
      _id: req.params.scooterId,
      userId: req.params.userId,
    };

    const rentScooterEvent = broker.constructEvent(eventTypes.rentScooterEvents.rentScooter, data);
    await broker.publish(rentScooterEvent);
    res.json(success('Renting scooter', data));
  });
};

exports.parkScooter = async (req, res) => {
  const broker = await mesBroker;
  checkLogin(broker, req, false, async (e) => {
    if (!e.loggedIn) {
      return res.json(notValidToken());
    }

    if (!e.admin) {
      return res.json(notAdmin());
    }

    const data = {
      _id: req.params.scooterId,
    };

    const parkScooterEvent = broker.constructEvent(
      eventTypes.returnScooterEvents.parkScooter,
      data,
    );
    await broker.publish(parkScooterEvent);
    res.json(success('Parking scooter', data));
  });
};

exports.simulateScooters = async (req, res) => {
  const broker = await mesBroker;
  checkLogin(broker, req, true, async (e) => {
    if (!e.loggedIn) {
      return res.json(notValidToken());
    }

    if (!e.admin) {
      return res.json(notAdmin());
    }

    const startSimulationEvent = broker.constructEvent(eventTypes.adminEvents.simulateScooters, {});
    await broker.publish(startSimulationEvent);
    res.json(success('Simulating scooters', {}));
  });
};

exports.stopSimulation = async (req, res) => {
  const broker = await mesBroker;
  checkLogin(broker, req, true, async (e) => {
    if (!e.loggedIn) {
      return res.json(notValidToken());
    }

    if (!e.admin) {
      return res.json(notAdmin());
    }

    const stopSimulationEvent = broker.constructEvent(eventTypes.adminEvents.stopSimulation, {});
    await broker.publish(stopSimulationEvent);
    res.json(success('Stopping simulation', {}));
  });
};

exports.addRandomScooters = async (req, res) => {
  const broker = await mesBroker;
  checkLogin(broker, req, true, async (e) => {
    if (!e.loggedIn) {
      return res.json(notValidToken());
    }

    if (!e.admin) {
      return res.json(notAdmin());
    }

    const data = {
      number: req.params.number,
      location: req.params.city,
    };

    const addRandomScootersEvent = broker.constructEvent(
      eventTypes.adminEvents.addRandomScooters,
      data,
    );
    await broker.publish(addRandomScootersEvent);
    res.json(success('Added scooters to system', data));
  });
};

/**
 * Get all scooters in a city or a specific scooter in a city if scooterId is provided.
 * @param {object} req
 * @param {object} res
 */
exports.getScooters = async (req, res) => {
  const filter = {
    location: req.params.city,
  };

  if (req.params.hasOwnProperty('scooterId')) {
    filter._id = req.params.scooterId;
  }

  const broker = await mesBroker;
  const getScootersEvent = broker.constructEvent(eventTypes.rpcEvents.getScooters, filter);
  broker.request(getScootersEvent, (e) => {
    res.json(e);
  });
};

/**
 * Add scooter to a city.
 * @param {object} req
 * @param {object} res
 */
exports.addScooter = async (req, res) => {
  const broker = await mesBroker;
  checkLogin(broker, req, true, (e) => {
    if (!e.loggedIn) {
      return res.json(notValidToken());
    }

    if (!e.admin) {
      return res.json(notAdmin());
    }

    const newScooter = {
      lng: parseFloat(req.body.lng),
      lat: parseFloat(req.body.lat),
      location: req.params.city,
    };

    const addScooterEvent = broker.constructEvent(eventTypes.rpcEvents.addScooter, newScooter);

    broker.request(addScooterEvent, (ev) => {
      res.json(success('Scooter added', ev));
    });
  });
};

/**
 * Update scooter in a city.
 * @param {object} req
 * @param {object} res
 */
exports.updateScooter = async (req, res) => {
  const broker = await mesBroker;
  checkLogin(broker, req, true, (e) => {
    if (!e.loggedIn) {
      return res.json(notValidToken());
    }

    if (!e.admin) {
      return res.json(notAdmin());
    }

    const scooterToUpdate = {
      _id: req.params.scooterId,
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

    const updateScooterEvent = broker.constructEvent(
      eventTypes.rpcEvents.updateScooter,
      scooterToUpdate,
    );

    broker.request(updateScooterEvent, (ev) => {
      res.json(success('Updated scooter', ev));
    });
  });
};

/**
 * Remove scooter in a city
 * @param {object} req
 * @param {object} res
 */
exports.removeScooter = async (req, res) => {
  const broker = await mesBroker;
  checkLogin(broker, req, true, (e) => {
    if (!e.loggedIn) {
      return res.json(notValidToken());
    }

    if (!e.admin) {
      return res.json(notAdmin());
    }

    const id = {
      _id: req.params.scooterId,
    };
    const removeScooterEvent = broker.constructEvent(eventTypes.rpcEvents.removeScooter, id);
    broker.request(removeScooterEvent, (ev) => {
      res.json(success('Removed scooter', ev));
    });
  });
};

/**
 * Get parking spots and charging stations in a city
 * @param {object} req
 * @param {object} res
 */
exports.getParkingspots = async (req, res) => {
  const filter = {
    location: req.params.city,
  };

  const broker = await mesBroker;
  const getParkingSpotsEvent = broker.constructEvent(eventTypes.rpcEvents.getParkingSpots, filter);
  broker.request(getParkingSpotsEvent, (e) => {
    res.json(e);
  });
};

/**
 * Add parking spot (or charging station) to a city.
 * @param {object} req
 * @param {object} res
 */
exports.addParkingspot = async (req, res) => {
  const broker = await mesBroker;
  checkLogin(broker, req, true, (e) => {
    if (!e.loggedIn) {
      return res.json(notValidToken());
    }

    if (!e.admin) {
      return res.json(notAdmin());
    }

    const newParkingSpot = {
      location: req.body.location,
      object: req.body.object,
    };

    const addParkingspotEvent = broker.constructEvent(
      eventTypes.rpcEvents.addParkingSpot,
      newParkingSpot,
    );

    broker.request(addParkingspotEvent, (ev) => {
      res.json(success('Parkingspot added', ev));
    });
  });
};

/**
 * Update parking spot (or charging station) in a city.
 * @param {object} req
 * @param {object} res
 */
exports.updateParkingspot = async (req, res) => {
  const broker = await mesBroker;
  checkLogin(broker, req, true, (e) => {
    if (!e.loggedIn) {
      return res.json(notValidToken());
    }

    if (!e.admin) {
      return res.json(notAdmin());
    }

    const parkingspotToUpdate = {
      location: req.body.location,
      object: req.body.object,
    };
    const updateParkingspotEvent = broker.constructEvent(
      eventTypes.rpcEvents.updateParkingSpot,
      parkingspotToUpdate,
    );

    broker.request(updateParkingspotEvent, (ev) => {
      res.json(success('Updated parkingspot', ev));
    });
  });
};

/**
 * Remove parking spot (or charging station) in a city.
 * @param {object} req
 * @param {object} res
 */
exports.removeParkingspot = async (req, res) => {
  const broker = await mesBroker;
  checkLogin(broker, req, true, (e) => {
    if (!e.loggedIn) {
      return res.json(notValidToken());
    }

    if (!e.admin) {
      return res.json(notAdmin());
    }

    const parkingspotToDelete = {
      location: req.body.location,
      object: req.body.object,
    };
    const removeParkingspotEvent = broker.constructEvent(
      eventTypes.rpcEvents.removeParkingSpot,
      parkingspotToDelete,
    );
    broker.request(removeParkingspotEvent, (ev) => {
      res.json(success('Removed parkingspot', ev));
    });
  });
};

/**
 * Get all users or a specific user if userId is provided.
 * @param {object} req
 * @param {object} res
 */
exports.getUsers = async (req, res) => {
  const broker = await mesBroker;
  let flag = true;
  if (req.params.hasOwnProperty('userId')) {
    flag = false;
  }

  checkLogin(broker, req, flag, (e) => {
    if (!e.loggedIn) {
      return res.json(notValidToken());
    }

    if (!e.admin) {
      return res.json(notAdmin());
    }

    const filter2 = {};
    if (!flag) {
      filter2._id = parseInt(req.params.userId);
    }
    const getUsersEvent = broker.constructEvent(eventTypes.rpcEvents.getUsers, filter2);
    broker.request(getUsersEvent, (ev) => {
      res.json(ev);
    });
  });
};

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
      _id: parseInt(req.body._id),
      name: req.body.name,
      mobile: req.body.mobile,
      mail: req.body.mail,
      city: req.body.city,
      address: req.body.address,
      zip: req.body.zip,
      balance: parseFloat(req.body.balance),
    };

    if (req.body.admin === 'true') {
      newUser.admin = true;
    } else {
      newUser.admin = false;
    }

    const addUserEvent = broker.constructEvent(eventTypes.rpcEvents.addUser, newUser);

    broker.request(addUserEvent, (ev) => {
      res.json(success('User added', ev));
    });
  });
};

/**
 * Update user.
 * @param {object} req
 * @param {object} res
 */
exports.updateUser = async (req, res) => {
  const broker = await mesBroker;
  let flag = true;
  if (parseInt(req.params.loginId) === parseInt(req.params.userId)) {
    flag = false;
  }

  checkLogin(broker, req, flag, (e) => {
    if (!e.loggedIn) {
      return res.json(notValidToken());
    }

    if (!e.admin) {
      return res.json(notAdmin());
    }

    const userToUpdate = {
      _id: parseInt(req.params.userId),
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

    broker.request(updateUserEvent, (ev) => {
      res.json(success('Updated user', ev));
    });
  });
};

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
      _id: parseInt(req.params.userId),
    });
    broker.request(removeUserEvent, (ev) => {
      res.json(success('Removed user', ev));
    });
  });
};

/**
 * Get token for user.
 * @param {object} req
 * @param {object} res
 */
exports.getToken = async (req, res) => {
  const broker = await mesBroker;
  const getTokenEvent = broker.constructEvent(eventTypes.accountEvents.getToken, {
    code: req.params.code,
  });

  broker.request(getTokenEvent, (e) => {
    res.json(success('Get token success', e));
  });
};

/**
 * Get token for user in web.
 * @param {object} req
 * @param {object} res
 */
exports.getWebToken = async (req, res) => {
  const broker = await mesBroker;
  const getWebTokenEvent = broker.constructEvent(eventTypes.accountEvents.getWebToken, {
    code: req.params.code,
  });

  broker.request(getWebTokenEvent, (e) => {
    res.json(success('Get token success', e));
  });
};

/**
 * Get information about the user from the GitHub API.
 * @param {object} req
 * @param {object} res
 */
exports.getGitHubUser = async (req, res) => {
  const broker = await mesBroker;
  const getGitHubUserEvent = broker.constructEvent(eventTypes.accountEvents.getGitHubUser, {
    token: req.headers['x-access-token'],
  });

  broker.request(getGitHubUserEvent, (e) => {
    res.json(success('Get github user success', e));
  });
};

exports.addInvoice = async (req, res) => {
  const broker = await mesBroker;
  checkLogin(broker, req, true, (e) => {
    if (!e.loggedIn) {
      return res.json(notValidToken());
    }

    if (!e.admin) {
      return res.json(notAdmin());
    }

    const newInvoice = req.body.invoice;
    const addInvoiceEvent = broker.constructEvent(eventTypes.rpcEvents.addInvoice, newInvoice);
    broker.request(addInvoiceEvent, (ev) => {
      res.json(success('Invoice added', ev));
    });
  });
};

/**
 * Get all invoices for a specific user or an invoice with a specific ID.
 * @param {object} req
 * @param {object} res
 */
exports.getInvoices = async (req, res) => {
  const broker = await mesBroker;
  let flag = true;
  if (req.params.hasOwnProperty('userId')) {
    if (parseInt(req.params.loginId) === parseInt(req.params.userId)) {
      flag = false;
    }
  }
  if (req.params.hasOwnProperty('invoiceId')) {
    flag = false;
  }

  checkLogin(broker, req, flag, (e) => {
    if (!e.loggedIn) {
      return res.json(notValidToken());
    }

    if (!e.admin) {
      return res.json(notAdmin());
    }

    const filter = {};

    if (req.params.hasOwnProperty('userId')) {
      filter.userId = req.params.userId;
    }
    if (req.params.hasOwnProperty('invoiceId')) {
      filter.invoiceId = req.params.invoiceId;
    }

    const getInvoicesEvent = broker.constructEvent(eventTypes.rpcEvents.getInvoices, filter);
    broker.request(getInvoicesEvent, (ev) => {
      res.json(ev);
    });
  });
};

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
  });
};

/**
 * Add rate.
 * @param {object} req
 * @param {object} res
 */
exports.addRate = async (req, res) => {
  const broker = await mesBroker;

  checkLogin(broker, req, true, (e) => {
    if (!e.loggedIn) {
      return res.json(notValidToken());
    }

    if (!e.admin) {
      return res.json(notAdmin());
    }

    const addRateEvent = broker.constructEvent(eventTypes.rpcEvents.addRate, req.body.newRate);

    broker.request(addRateEvent, (ev) => {
      res.json(success('Rate added', ev));
    });
  });
};

/**
 * Update rate with specific id.
 * @param {object} req
 * @param {object} res
 */
exports.updateRate = async (req, res) => {
  const broker = await mesBroker;
  checkLogin(broker, req, true, (e) => {
    if (!e.loggedIn) {
      return res.json(notValidToken());
    }

    if (!e.admin) {
      return res.json(notAdmin());
    }

    const rateToUpdate = {
      _id: req.body._id,
      object: req.body.object,
    };
    const updateRate = broker.constructEvent(eventTypes.rpcEvents.updateRate, rateToUpdate);

    broker.request(updateRate, (ev) => {
      res.json(success('Updated rate', ev));
    });
  });
};

/**
 * Remove rate with id.
 * @param {object} req
 * @param {object} res
 */
exports.removeRate = async (req, res) => {
  const broker = await mesBroker;

  checkLogin(broker, req, true, (e) => {
    if (!e.loggedIn) {
      return res.json(notValidToken());
    }

    if (!e.admin) {
      return res.json(notAdmin());
    }

    const removeRateEvent = broker.constructEvent(eventTypes.rpcEvents.removeRate, {
      _id: req.body._id,
    });
    broker.request(removeRateEvent, (ev) => {
      res.json(success('Removed rate', ev));
    });
  });
};
