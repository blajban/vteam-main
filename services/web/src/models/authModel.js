const authModel = {

    login: async function login() {
        const response = await fetch('http://localhost:3500/login')
        const data = await response.json();
        return data;
    },

    logout: async function logout() {
        const response = await fetch('http://localhost:3500/logout')
        const data = await response.json();
        return data;
    }
}

export default authModel;
