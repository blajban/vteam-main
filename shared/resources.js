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
        userAdded: "userAdded",
        userUpdated: "userUpdated",
        login: "login",
        userLoggedin: "userLoggedin",
        logout: "logout",
        userLoggedout: "userLoggedout",
        updateUserInfo: "updateUserInfo",
        userInfoUpdated: "userInfoUpdated",
        addMoney: "addMoney",
        moneyAdded: "moneyAdded"
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
    }
};

module.exports = { host, eventTypes }

