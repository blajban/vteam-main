const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes } = require('../../shared/resources');
const { UserHandler } = require('./models/userHandler');
const { AuthHandler } = require('./models/authHandler');

/**
 * User service
 * Handles events and RPC calls when it comes to:
 * Login and logout users
 * Add, update information and remove users
 */
const userService = async () => {
    const broker = await new MessageBroker(host, 'user_service');
    const uh = await new UserHandler();
    const ah = await new AuthHandler();

    /**
     * Get all users or one user if userId is specified
     */
    broker.response(eventTypes.rpcEvents.getUsers, (e) => {
        if (e.data.userId) {
            console.log(uh.getUser(e.data.userId));
            return uh.getUser(e.data.userId);
        }
        console.log(uh.getUsers());
        return uh.getUsers();
    });

    /**
     * Add user
     */
    broker.response(eventTypes.rpcEvents.addUser, (e) => {
        console.log(uh.addUser(e.data));
        return uh.addUser(e.data);
    });

    /**
     * Update user
     */
    broker.response(eventTypes.rpcEvents.updateUser, (e) => {
        console.log(uh.updateUser(e.data));
        return uh.updateUser(e.data);
    })

    /**
     * Remove user
     */
    broker.response(eventTypes.rpcEvents.removeUser, (e) => {
        console.log(uh.removeUser(e.data.userId));
        return uh.removeUser(e.data.userId);
    })

    /**
     * Login user
     */
    broker.response(eventTypes.accountEvents.login, (e) => {
        return ah.login(e.data.code);
    })

    /**
     * TODO
     */
    broker.response(eventTypes.accountEvents.logout, (e) => {
        // TODO
        return ah.logout(e.data.code);
    })
}

userService();

module.exports = userService;
