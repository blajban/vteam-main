const usersModel = {

    getAllUsers: async function getAllUsers() {
        const response = await fetch('http://localhost:3500/users')
        const data = await response.json();
        return data
    },

    addUser: async function addUser(newUser) {
        const response = await fetch('http://localhost:3500/users', {
            body: JSON.stringify(newUser),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
        });

        await response.json();
    },

    getUser: async function getUser(userId) {
        const response = await fetch(`http://localhost:3500/users/${userId}`);
        const data = await response.json();
        return data
    },

    updateUser: async function updateUser(userToUpdate) {
        const response = await fetch(`http://localhost:3500/users/${userToUpdate.id}`, {
            body: JSON.stringify(userToUpdate),
            headers: {
                'content-type': 'application/json'
            },
            method: 'PUT'
        });

        await response.json();
    },

    deleteUser: async function deleteUser(userToDelete) {
        const response = await fetch(`http://localhost:3500/users/${userToDelete.id}`, {
            headers: {
                'content-type': 'application/json'
            },
            method: 'DELETE'
        });

        await response.json();
    }
}

export default usersModel;
