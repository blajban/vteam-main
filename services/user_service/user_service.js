const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes, exchanges } = require('../../shared/resources');

/**
 * Main function to set up event flow. Listens for events and sends event with correct data.
 */
const userService = async () => {
    const systemBroker = await new MessageBroker(host, exchanges.system, 'user_service');
    const userManager = new UserManager();

    // Account events
    systemBroker.onEvent(eventTypes.accountEvents.createAccount, (e) => {
        const data = {
            id: 1,
            name: "Eric Samuelsson",
            mobile: "0701234567",
            mail: "example@example.com",
            city: "Karlskrona",
            address: "Karlskronagatan 45",
            zip: "4545",
            admin: false,
            account: 0
        };
        userManager.accountCreated(data);
        console.log("Account created");
    });

    systemBroker.onEvent(eventTypes.accountEvents.login, (e) => {
        const data = {
            token: "abc3rfg5fhrrye2t3d1gwsfw8ew6r"
        };
        userManager.userLoggedin(data);
        console.log("User logged in");
    });

    systemBroker.onEvent(eventTypes.accountEvents.logout, (e) => {
        const data = {
            token: "abc3rfg5fhrrye2t3d1gwsfw8ew6r"
        };
        userManager.userLoggedout(data);
        console.log("User logged out");
    });

    systemBroker.onEvent(eventTypes.accountEvents.updateUserInfo, (e) => {
        const data = {
            id: 1,
            name: "Eric Samuelsson",
            mobile: "0701234568",
            mail: "example@example.com",
            city: "Karlskrona",
            address: "Karlskronagatan 22",
            zip: "4540",
            admin: true,
            account: 0
        };
        userManager.userInfoUpdated(data);
        console.log("User info updated");
    });

    systemBroker.onEvent(eventTypes.accountEvents.addMoney, (e) => {
        const data = {
            id: 1,
            name: "Eric Samuelsson",
            mobile: "0701234568",
            mail: "example@example.com",
            city: "Karlskrona",
            address: "Karlskronagatan 22",
            zip: "4540",
            admin: true,
            account: 250
        };
        userManager.moneyAdded(data);
        console.log("Money added");
    });

    // RPC
    systemBroker.response(eventTypes.rpcEvents.getUsers, (e) => {
        return data;
    });

    // Admin event
    systemBroker.onEvent(eventTypes.adminEvents.adjustUserBalance, (e) => {
        console.log("Admin update user balance");
    })
}

class UserManager {
    constructor() {
        console.log("User manager initialized");
    }

    accountCreated() {
        return true;
    }

    userLoggedin() {
        return true;
    }

    userLoggedout() {
        return true;
    }

    userInfoUpdated() {
        return true;
    }

    moneyAdded() {
        return true;
    }
}

userService();
