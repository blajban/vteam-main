const {apiKey} = require('../../../api-key.json');

const usersModel = {
    getAllUsers: async function getAllUsers(token, loginId) {
        const response = await fetch(`http://localhost:3500/v1/users/${loginId}`, {
            headers: {
                'x-access-token': token,
                'x-api-key': apiKey
            },
        });
        const data = await response.json();
        return data;
    },

    addUser: async function addUser(user, token, loginId) {
        const response = await fetch(`http://localhost:3500/v1/users/${loginId}`, {
            body: JSON.stringify(user),
            headers: {
                'content-type': 'application/json',
                'x-access-token': token,
                'x-api-key': apiKey
            },
            method: 'POST',
        });

        await response.json();
    },

    getUser: async function getUser(token, userId, loginId) {
        const response = await fetch(`http://localhost:3500/v1/users/${loginId}/${userId}`, {
            headers: {
                'x-access-token': token,
                'x-api-key': apiKey
            },
        });
        const data = await response.json();
        return data;
    },

    updateUser: async function updateUser(token, user, loginId) {
        const response = await fetch(`http://localhost:3500/v1/users/${loginId}/${user._id}`, {
            body: JSON.stringify(user),
            headers: {
                'content-type': 'application/json',
                'x-access-token': token,
                'x-api-key': apiKey
            },
            method: 'PUT'
        });

        await response.json();
    },

    deleteUser: async function deleteUser(token, user, loginId) {
        const response = await fetch(`http://localhost:3500/v1/users/${loginId}/${user._id}`, {
            headers: {
                'content-type': 'application/json',
                'x-access-token': token,
                'x-api-key': apiKey
            },
            method: 'DELETE'
        });

        await response.json();
    }
}

export default usersModel;
