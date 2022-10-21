const tokenGenerator = async (username, password) => {
    let config = {
        phone_number: username,
        password: password
    }
    try {
        return await axios.post('/api/token/', config);
    } catch (error) {
        console.log(error.response)
        return error.response
    }
};

const newTokenGenerator = async () => {
    let data = {
        refresh: localStorage.getItem('refreshToken')
    }
    try {
        const response = await axios.post('/api/refresh/', data)
        return response
    }
    catch (error) {
        console.log(error.response)
        return error.response
    }
}


