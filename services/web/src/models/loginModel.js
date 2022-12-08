const loginModel = {

    login: async function login() {
        const response = await fetch('http://localhost:3500/login')
        const data = await response.json();
        return data
    }
}

export default loginModel;
