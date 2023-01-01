const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes } = require('../../shared/resources');
const { UserHandler } = require('./models/userHandler');
const { AuthHandler } = require('./models/authHandler');
const { MongoWrapper } = require('../../shared/mongowrapper');

/**
 * User service
 * Handles events and RPC calls when it comes to:
 * Login and logout users
 * Add users, update information and remove users
 */
const userService = async () => {
  const mongoWrapper = await new MongoWrapper('users');
  const broker = await new MessageBroker(host, 'user_service');
  const userHandler = await new UserHandler(mongoWrapper);
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
  });

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
  });

  /**
   * Exchanges the temp code for a token from GitHub.
   *
   * @param {string} eventType - The type of event to handle.
   * @param {function} handler - The function to handle the event.
   * @returns {function}
   */
  broker.response(eventTypes.accountEvents.getToken, async (e) => {
    return await authHandler.getToken(e.data.code);
  });

  /**
   * With a token, information about the user is retrieved from
   * GitHub's API.
   *
   * @param {string} eventType - The type of event to handle.
   * @param {function} handler - The function to handle the event.
   * @returns {function}
   */
  broker.response(eventTypes.accountEvents.getGitHubUser, async (e) => {
    return await authHandler.getGitHubUser(e.data.token);
  });
};

userService();

module.exports = userService;
