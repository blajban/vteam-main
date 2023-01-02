const usersModel = {
    getAllUsers: async function getAllUsers(token) {
        // 12345678 ska egentligen vara loginId
        const response = await fetch('http://localhost:3500/v1/users/12345678',
        {
            headers: {
                'x-access-token': token,
            },
        });
        const data = await response.json();
        return data;
    },

    addUser: async function addUser(user) {
        // 12345678 ska egentligen vara loginId
        const response = await fetch('http://localhost:3500/v1/users/12345678', {
            body: JSON.stringify(user),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
        });

        await response.json();
    },

    getUser: async function getUser(userId, token) {
        // den första userId ska egentligen vara loginId
        const response = await fetch(`http://localhost:3500/v1/users/${userId}/${userId}`,
        {
            headers: {
                'x-access-token': token,
            },
        });
        const data = await response.json();
        return data;
    },

    updateUser: async function updateUser(user) {
        // den första user._id ska egentligen vara loginId
        const response = await fetch(`http://localhost:3500/v1/users/${user._id}/${user._id}`, {
            body: JSON.stringify(user),
            headers: {
                'content-type': 'application/json'
            },
            method: 'PUT'
        });

        await response.json();
    },

    deleteUser: async function deleteUser(user) {
        // den första user._id ska egentligen vara loginId
        const response = await fetch(`http://localhost:3500/v1/users/${user._id}/${user._id}`, {
            headers: {
                'content-type': 'application/json'
            },
            method: 'DELETE'
        });

        await response.json();
    }
}

export default usersModel;
