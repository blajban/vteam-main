const usersModel = {
    getAllUsers: async function getAllUsers() {
        const response = await fetch('http://localhost:3500/v1/users');
        const data = await response.json();
        return data.content;
    },

    addUser: async function addUser(user) {
        const response = await fetch('http://localhost:3500/v1/users', {
            body: JSON.stringify(user),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
        });

        await response.json();
    },

    getUser: async function getUser(userId, token) {
        const response = await fetch(`http://localhost:3500/v1/users/${userId}`,
        {
            headers: {
                'x-access-token': token,
            },
        });
        const data = await response.json();
        return data;
    },

    updateUser: async function updateUser(user) {
        const response = await fetch(`http://localhost:3500/v1/users/${user.userId}`, {
            body: JSON.stringify(user),
            headers: {
                'content-type': 'application/json'
            },
            method: 'PUT'
        });

        await response.json();
    },

    deleteUser: async function deleteUser(user) {
        const response = await fetch(`http://localhost:3500/v1/users/${user.userId}`, {
            headers: {
                'content-type': 'application/json'
            },
            method: 'DELETE'
        });

        await response.json();
    }
}

export default usersModel;
