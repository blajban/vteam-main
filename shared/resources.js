const host = 'amqp://rabbitmq';

const eventTypes = {
  rentScooterEvents: {
    rentScooter: "rentScooter",
    unlockScooter: "unlockScooter",
    scooterUnlocked: "scooterUnlocked",
    rideStarted: "rideStarted"
  },
  scooterEvents: {
    scooterIdleReporting: "scooterIdleReporting",
    scooterMoving: "scooterMoving",
    batteryLow: "batteryLow",
    outOfBounds: "outOfBounds",
    scooterAdded: "scooterAdded",
    scooterUpdated: "scooterUpdated",
    scooterRemoved: "scooterRemoved"
  },
  returnScooterEvents: {
    parkScooter: "parkScooter",
    lockScooter: "lockScooter",
    scooterLocked: "scooterLocked",
    rideFinished: "rideFinished",
    establishParkingRate: "establishParkingRate"
  },
  accountEvents: {
    getToken: "getToken",
    getWebToken: "getWebToken",
    getGitHubUser: "getGitHubUser",
    checkLogin: "checkLogin"
  },
  paymentEvents: {
    invoiceCreated: "invoiceCreated",
    invoicePaid: "invoicePaid"
  },
  rpcEvents: {
    getScooters: "getScooters",
    addScooter: "addScooter",
    updateScooter: "updateScooter",
    removeScooter: "removeScooter",
    getUsers: "getUsers",
    addUser: "addUser",
    updateUser: "updateUser",
    removeUser: "removeUser",
    getInvoices: "getInvoices",
    addInvoice: "addInvoice",
    getParkingSpots: "getParkingSpots",
    addParkingSpot: "addParkingSpot",
    updateParkingSpot: "updateParkingSpot",
    removeParkingSpot: "removeParkingSpot",
    getChargingStations: "getChargingStations",
    getRates: "getRates",
    addRate: "addRate",
    updateRate: "updateRate",
    removeRate: "removeRate"
  },
  adminEvents: {
    testEvent: "testEvent",
    getLog: "getLog",
    adjustUserBalance: "adjustUserBalance",
    moveScooter: "moveScooter",
    adjustRates: "adjustRates",
    simulateScooters: "simulateScooters",
    stopSimulation: "stopSimulation",
    parkingSpotAdded: "parkingSpotAdded",
    parkingSpotUpdated: "parkingSpotUpdated",
    parkingSpotRemoved: "parkingSpotRemoved",
    addRandomScooters: "addRandomScooters"
  }
};

const coordinates = {
  stockholm: {
      lngMin: 17.687988281250004,
      lngMax: 18.391113281250004,
      latMin: 59.17029835064485,
      latMax: 59.478568831926395,
  },
  goteborg: {
      lngMin: 11.744384765625002,
      lngMax: 12.1728515625,
      latMin: 57.610107020683905,
      latMax: 57.856443276115066,
  },
  malmo: {
      lngMin: 12.897949218750002,
      lngMax: 13.205566406250002,
      latMin: 55.49130362820423,
      latMax: 55.64659898563683,
  }
};

module.exports = { host, eventTypes, coordinates };

