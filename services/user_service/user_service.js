const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes } = require('../../shared/resources');

const users = require('../../shared/dummy_data/user_service/users.json');

/**
 * Main function to set up event flow. Listens for events and sends event with correct data.
 */
const userService = async () => {
    const broker = await new MessageBroker(host, 'user_service');
    const userManager = new UserManager();

    const e1 = broker.constructEvent(eventTypes.accountEvents.createAccount, { user: users[1] });
    broker.request(e1, (res) => {
        console.log(res);
    });

    broker.onEvent(eventTypes.accountEvents.createAccount, (e) => {
        userManager.accountCreated(e.user);
    });

    const e2 = broker.constructEvent(eventTypes.accountEvents.login, {token: "abc3rfg5fhrrye2t3d1gwsfw8ew6r"});
    broker.request(e2, (res) => {
        console.log(res);
    })

    broker.onEvent(eventTypes.accountEvents.login, (e) => {
        userManager.userLoggedin(e.token);
    });

    const e3 = broker.constructEvent(eventTypes.accountEvents.logout, {token: "abc3rfg5fhrrye2t3d1gwsfw8ew6r"});
    broker.request(e3, (res) => {
        console.log(res);
    });

    broker.onEvent(eventTypes.accountEvents.logout, (e) => {
        userManager.userLoggedout(e.token);
    });

    const updateUserInfo = {
        "id": 1,
        "name": "Selma Helin",
        "mobile": "0705556747",
        "mail": "selma.helin@hallaryd.com",
        "city": "Hällaryd",
        "address": "Hällarydsvägen 14",
        "zip": "37470",
        "admin": true,
        "account": 250.90
    };

    const e4 = broker.constructEvent(eventTypes.accountEvents.updateUserInfo, {user: updateUserInfo});
    broker.request(e4, (res) => {
        console.log(res);
    });

    broker.onEvent(eventTypes.accountEvents.updateUserInfo, (e) => {
        userManager.userInfoUpdated(e.user);
    });

    const e5 = broker.constructEvent(eventTypes.rpcEvents.getUsers);
    broker.request(e5, (res) => {
        console.log(res);
    })

    broker.response(eventTypes.rpcEvents.getUsers, (e) => {
        return userManager.getUsers();
    });
}

class UserManager {
    constructor() {
        console.log("User manager initialized");
        this.users = users;
    }

    accountCreated(newUser) {
        for (const user of this.users) {
            if (user.id === newUser.id) {
                console.log(newUser);
                return "Konto skapat";
            }
        }
        return "Något gick fel när konto skulle skapas";
    }

    userLoggedin(token) {
        if (token === "abc3rfg5fhrrye2t3d1gwsfw8ew6r") {
            console.log("Användare inloggad");
            return "Användare inloggad";
        }
        return "Något gick fel när användare skulle logga in";
    }

    userLoggedout(token) {
        if (token === "abc3rfg5fhrrye2t3d1gwsfw8ew6r") {
            console.log("Användare utloggad");
            return "Användare utloggad";
        }
        return "Något gick fel när användare skulle logga ut";
    }

    userInfoUpdated(updateUser) {
        for (const user of this.users) {
            if (user.id === updateUser.id) {
                user.name = updateUser.name;
                user.mobile = updateUser.mobile;
                user.mail = updateUser.mail;
                user.city = updateUser.city;
                user.address = updateUser.address;
                user.zip = updateUser.zip;
                user.admin = updateUser.admin;
                user.account = updateUser.account;
                console.log(user);
                return "Användaruppgifter uppdaterade";
            }
        }
        return "Något gick fel för användaruppgifter skulle uppdateras";
    }

    getUsers() {
        console.log("Hej");
        console.log(this.users);
        return this.users;
    }
}

userService();
