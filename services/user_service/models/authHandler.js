const { MongoWrapper } = require('../../../shared/mongowrapper');
const { UserHandler } = require('./userHandler');

/**
 * AuthHandler handles login and logout.
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

    async getOAuthToken(code) {
        const client_id = process.env.GITHUB_CLIENT_ID;
        const client_secret = process.env.GITHUB_CLIENT_SECRET;
        const redirect_uri = 'https://localhost:9001/';

        const response = await fetch('https://github.com/login/oauth/access_token', {
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                client_id,
                client_secret,
                code,
                redirect_uri
            }),
            method: "POST"
        })
    
        //const result = await response.text();
        //const params = new URLSearchParams(result);
        //return params.get("access_token")
        const result = await response.json();
        const token = result.access_token;
        return token;
    }

    async getGitHubUser(token) {
        const response = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `bearer ${token}`
            }
        })

        const data = await response.json();
        return data;
    }

    async login(code) {
        const token = await getOAuthToken(code);
        const gitHubUser = await getGitHubUser(token);
        const userId = await checkUser(gitHubUser);
        const userObj = {
            userId: userId,
            token: token
        }
        return userObj;
    }

    async checkUser(userToCheck) {
        const userHandler = await new UserHandler();
        //const user = await this.db.findOne(this.collectionName, {userId: userToCheck.id});
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
        //const findNewUser = await this.db.findOne(this.collectionName, {userId: userToCheck.id});
        const findNewUser = await userHandler.getUser(userToCheck._id);
        return findNewUser._id;
    }

    // TODO
    async logout() {
        try {
            console.log("Hej");
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = { AuthHandler };
