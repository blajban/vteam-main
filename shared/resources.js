const host = 'amqp://localhost';

const exchanges = {
    scooters: "scooters",
    system: "system",
    admin: "admin"
};

const eventTypes = {
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
        balanceUpdated: "balanceUpdated"
    },
    rentScooterEvents: {
        rentScooter: "rentScooter",
        unlockScooter: "unlockScooter",
        scooterUnlocked: "scooterUnlocked",
        rideStarted: "rideStarted",
        setSpeedLimitZones: "setSpeedLimitZones"
    },
    driveScooterEvents: {
        scooterMoving: "scooterMoving",
        batteryLow: "batteryLow"
    },
    returnScooterEvents: {
        parkScooter: "parkScooter",
        lockScooter: "lockScooter",
        scooterLocked: "scooterLocked",
        rideFinished: "rideFinished"
    },
    paymentEvents: {
        parkingRateEstablished: "parkingRateEstablished",
        invoiceCreated: "invoiceCreated",
        invoicePaid: "invoicePaid"
    },
    adminEvents: {
        testEvent: "testEvent",
        getLog: "getLog",
        getData2: "getData2"
    }
};




module.exports = { host, exchanges, eventTypes, eventTypesPlain }

