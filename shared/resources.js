const host = 'amqp://rabbitmq';

const exchanges = {
    scooters: "scooters",
    system: "system",
    admin: "admin"
};

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
        batteryLow: "batteryLow"
    },
    returnScooterEvents: {
        parkScooter: "parkScooter",
        lockScooter: "lockScooter",
        scooterLocked: "scooterLocked",
        rideFinished: "rideFinished",
        establishParkingRate: "establishParkingRate"
    },
    accountEvents: {
        createAccount: "createAccount",
        accountCreated: "accountCreated",
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
        getUsers: "getUsers",
        getInvoices: "getInvoices",
        getParkingSpots: "getParkingSpots",
        getChargingStations: "getChargingStations",
        getRates: "getRates"
    },
    adminEvents: {
        testEvent: "testEvent",
        getLog: "getLog",
        getData2: "getData2",
        adjustParkingSpot: "adjustParkingSpot",
        adjustChargingStation: "adjustChargingStation",
        adjustUserBalance: "adjustUserBalance",
        moveScooter: "moveScooter",
        adjustRates: "adjustRates",
        simulateScooters: "simulateScooters"
    }
};

module.exports = { host, exchanges, eventTypes }

