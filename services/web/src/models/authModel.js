const api_key = require('../api-key.json');

const authModel = {
    getToken: async function getToken(code) {
        console.log(api_key.key);
        const response = await fetch(`http://localhost:3500/v1/getWebToken/${code}`, {
            headers: {
                'x-api-key': api_key.key
            },
        });
        const data = await response.json();
        return data.content;
    },

    getGitHubUser: async function getGitHubUser(token) {
        const response = await fetch(`http://localhost:3500/v1/getGitHubUser`, {
            headers: {
                'x-access-token': token,
                'x-api-key': api_key.key
            },
        });
        const data = await response.json();
        return data.content;
    }
}

export default authModel;
