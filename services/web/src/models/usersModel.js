const api_key = require('../api-key.json');

const usersModel = {
    getAllUsers: async function getAllUsers(token, loginId) {
        const response = await fetch(`http://localhost:3500/v1/users/${loginId}`, {
            headers: {
                'x-access-token': token,
                'x-api-key': api_key.key
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
                'x-api-key': api_key.key
            },
            method: 'POST',
        });

        await response.json();
    },

    getUser: async function getUser(token, userId, loginId) {
        const response = await fetch(`http://localhost:3500/v1/users/${loginId}/${userId}`, {
            headers: {
                'x-access-token': token,
                'x-api-key': api_key.key
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
                'x-api-key': api_key.key
            },
            method: 'PUT'
        });

        await response.json();
    },

    deleteUser: async function deleteUser(token, userId, loginId) {
        const response = await fetch(`http://localhost:3500/v1/users/${loginId}/${userId}`, {
            headers: {
                'content-type': 'application/json',
                'x-access-token': token,
                'x-api-key': api_key.key
            },
            method: 'DELETE'
        });

        await response.json();
    }
}

export default usersModel;
