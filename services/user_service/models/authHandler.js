const axios = require('axios').default;
const { MongoWrapper } = require('../../../shared/mongowrapper');
const { UserHandler } = require('./userHandler');

/**
 * AuthHandler handles login.
 */
class AuthHandler {
    constructor() {
        return this.#init();
    }

    async #init() {
        this.db = await new MongoWrapper('users');
        this.collectionName = 'users';
        return this;
    }

    /**
     * Returns the token which we get from GitHub.
     * @param {string} code - Temp code that we went to exchange for a token.
     * @returns {string} The token.
     */
    async getToken(code) {
        const client_id = process.env.GITHUB_CLIENT_ID;
        const client_secret = process.env.GITHUB_CLIENT_SECRET;

        try {
            const response = await axios.post(
                `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}`, {
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json'
                }
            });

            const result = await response.data;
            const token = result.substring(13,53);
            return token;
        } catch(error) {
            console.log(error);
        }
    }

    /**
     * Gets information about the user from GitHub's API through a token
     * @param {string} token - the token.
     * @returns {function}
     */
    async getGitHubUser(token) {
        try {
            const response = await axios.get('https://api.github.com/user', {
                headers: {
                    'authorization': `bearer ${token}`
                }
            });

            const result = await response.data;
            return await this.checkUser(result);
        } catch(error) {
            console.log(error);
        }
    }

    /**
     * Checks if the user already exists in the database,
     * otherwise the user is added.
     * @param {Object} userToCheck - The user's information from GitHub.
     * @returns {number} The user's ID.
     */
    async checkUser(userToCheck) {
        const userHandler = await new UserHandler();
        const user = await userHandler.getUser(userToCheck.id);
        if (user) {
            return user._id;
        }

        const newUser = {
            "_id": userToCheck.id,
            "mobile": "",
            "city": "",
            "address": "",
            "zip": "",
            "admin": false,
            "balance": 0
        }
        if (userToCheck.name) {
            newUser.name = userToCheck.name;
        } else {
            newUser.name = "";
        }
        if (userToCheck.email) {
            newUser.mail = userToCheck.email;
        } else {
            newUser.mail = "";
        }

        await userHandler.addUser(newUser);
        const findNewUser = await userHandler.getUser(userToCheck._id);
        return findNewUser._id;
    }
}

module.exports = { AuthHandler };
