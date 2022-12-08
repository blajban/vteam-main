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
        getInvoices: "getInvoices",
        getParkingSpots: "getParkingSpots",
        addParkingspot: "addParkingspot",
        updateParkingspot: "updateParkingspot",
        removeParkingspot: "removeParkingspot",
        getChargingStations: "getChargingStations",
        addChargingStation: "addChargingStation",
        updateChargingStation: "updateChargingStation",
        removeChargingStation: "removeChargingStation",
        getRates: "getRates"
    },
    adminEvents: {
        testEvent: "testEvent",
        getLog: "getLog",
        chargingStationAdded: "chargingStationAdded",
        chargingStationUpdated: "chargingStationUpdated",
        chargingStationRemoved: "chargingStationRemoved",
        adjustUserBalance: "adjustUserBalance",
        moveScooter: "moveScooter",
        adjustRates: "adjustRates",
        simulateScooters: "simulateScooters",
        stopSimulation: "stopSimulation",
        parkingspotAdded: "parkingspotAdded",
        parkingspotUpdated: "parkingspotUpdated",
        parkingspotRemoved: "parkingspotRemoved",
    }
};

module.exports = { host, eventTypes }

