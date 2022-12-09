const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes } = require('../../shared/resources');
const userHandler = require('./models/userHandler');
const authHandler = require('./models/authHandler');

/**
 * Main function to set up event flow. Listens for events and sends event with correct data.
 */
const userService = async () => {
    const broker = await new MessageBroker(host, 'user_service');

    broker.response(eventTypes.rpcEvents.getUsers, (e) => {
        if (e.data.userId) {
            return userHandler.getUser(e.data.userId);
        }
        return userHandler.getUsers();
    });

    broker.response(eventTypes.rpcEvents.addUser, (e) => {
        return userHandler.addUser(e.data);
    });

    broker.response(eventTypes.rpcEvents.updateUser, (e) => {
        return userHandler.updateUser(e.data);
    })

    broker.response(eventTypes.rpcEvents.removeUser, (e) => {
        return userHandler.removeUser(e.data.userId);
    })

    broker.response(eventTypes.accountEvents.login, (e) => {
        return authHandler.login(e.data.code);
    })

    broker.response(eventTypes.accountEvents.logout, (e) => {
        // TODO
        return authHandler.logout(e.data.code);
    })
}

userService();

module.exports = userService;
