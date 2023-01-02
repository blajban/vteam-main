const authModel = {
    getToken: async function getToken(code) {
        const response = await fetch(`http://localhost:3500/v1/getToken/${code}`);
        const data = await response.json();
        return data.content;
    },

    getGitHubUser: async function getGitHubUser(token) {
        const response = await fetch(`http://localhost:3500/v1/getGitHubUser`, {
            headers: {
                'x-access-token': token,
            },
        });
        const data = await response.json();
        return data.content;
    }
}

export default authModel;
