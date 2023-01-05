const axios = require('axios').default;
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
   * Exchanges the temp code for a web token from GitHub.
   *
   * @param {string} eventType - The type of event to handle.
   * @param {function} handler - The function to handle the event.
   * @returns {function}
   */
  broker.response(eventTypes.accountEvents.getWebToken, async (e) => {
    return await authHandler.getWebToken(e.data.code);
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

  /**
   * Check if the token is valid and if the user has admin rights.
   *
   * @param {string} eventType - The type of event to handle.
   * @param {function} handler - The function to handle the event.
   * @returns {object}
   */
  broker.response(eventTypes.accountEvents.checkLogin, async (e) => {
    const testToken = process.env.TESTTOKEN;
    const testAdminId = parseInt(process.env.TESTADMINID);

    if (e.data.token === testToken) {
      if (e.data.userId === testAdminId) {
        const obj = {
          loggedIn: true,
          admin: true
        }
        return obj;
      }
    }
    try {
      const response = await axios.get('https://api.github.com/user', {
        headers: {
          authorization: `bearer ${e.data.token}`,
        },
      });

      const result = await response.data;
      if (result.id === e.data.userId) {
        if (e.data.checkAdmin) {
          const user = await userHandler.getUser(e.data.userId);
          if (user.admin === true) {
            // checks if the user is admin and it is
            const obj2 = {
              loggedIn: true,
              admin: true
            }
            return obj2;
          }
          // checks if the user is admin and it is not
          const obj3 = {
            loggedIn: true,
            admin: false
          }
          return obj3;
        }
        // does not check if the user is admin and has a valid token
        const obj4 = {
          loggedIn: true,
          admin: true
        }
        return obj4;
      }
      // does not check if the user is admin and does not have a valid token
      const obj5 = {
        loggedIn: false,
        admin: false
      }
      return obj5;
    } catch (error) {
      return false;
    }
  });
};

userService();

module.exports = userService;
