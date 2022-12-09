const logoutModel = {

    logout: async function logout() {
        const response = await fetch('http://localhost:3500/logout')
        const data = await response.json();
        return data
    }
}

export default logoutModel;
