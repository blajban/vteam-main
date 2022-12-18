const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes } = require('../../shared/resources');
const { UserHandler } = require('./models/userHandler');
const { AuthHandler } = require('./models/authHandler');

/**
 * User service
 * Handles events and RPC calls when it comes to:
 * Login and logout users
 * Add users, update information and remove users
 */
const userService = async () => {
    const broker = await new MessageBroker(host, 'user_service');
    const userHandler = await new UserHandler();
    const authHandler = await new AuthHandler();

    /**
     * Registers a response to getUsers event.
     * Get all users or one user if userId is specified.
     * 
     * @param {string} eventType - The type of event to handle.
     * @param {function} handler - The function to handle the event.
     * @returns {function}
     */
    broker.response(eventTypes.rpcEvents.getUsers, async (e) => {
        if (e.data._id) {
            return await userHandler.getUser(e.data._id);
        }
        return await userHandler.getUsers();
    });

    /**
     * Registers a response to addUser event.
     * 
     * @param {string} eventType - The type of event to handle.
     * @param {function} handler - The function to handle the event.
     * @returns {function}
     */
    broker.response(eventTypes.rpcEvents.addUser, async (e) => {
        return await userHandler.addUser(e.data);
    });

    /**
     * Registers a response to updateUser event.
     * 
     * @param {string} eventType - The type of event to handle.
     * @param {function} handler - The function to handle the event.
     * @returns {function}
     */
    broker.response(eventTypes.rpcEvents.updateUser, async (e) => {
        return await userHandler.updateUser(e.data);
    })

    /**
     * Registers a response to removeUser event.
     * Get all users or one user if userId is specified.
     * 
     * @param {string} eventType - The type of event to handle.
     * @param {function} handler - The function to handle the event.
     * @returns {function}
     */
    broker.response(eventTypes.rpcEvents.removeUser, async (e) => {
        return await userHandler.removeUser(e.data._id);
    })

    /**
     * Registers a response to login event.
     * 
     * @param {string} eventType - The type of event to handle.
     * @param {function} handler - The function to handle the event.
     * @returns {function}
     */
    broker.response(eventTypes.accountEvents.login, async (e) => {
        return await authHandler.login(e.data.code);
    })

    /**
     * Registers a response to logout event.
     * Get all users or one user if userId is specified.
     * 
     * @param {string} eventType - The type of event to handle.
     * @param {function} handler - The function to handle the event.
     * @returns {function}
     */
    broker.response(eventTypes.accountEvents.logout, async (e) => {
        // TODO
        return await authHandler.logout(e.data.code);
    })
}

userService();

module.exports = userService;
