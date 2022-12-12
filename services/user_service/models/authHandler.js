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

        const response = await fetch('https://github.com/login/oauth/access_token', {
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                client_id,
                client_secret,
                code
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
        const user = await checkUser(gitHubUser);
        user.token = token;
        return user;
    }

    async checkUser(userToCheck) {
        const user = await this.db.findOne(this.collectionName, {userId: userToCheck.id});
        if (!user) {
            const userHandler = await new UserHandler();
            const newUser = {
                "userId": userToCheck.id,
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
            userHandler.addUser(newUser);
            return newUser;
        }
        return user;
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
