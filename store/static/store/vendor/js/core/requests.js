const sendRequest = async ({
    method: method = 'GET',
    auth: auth = false,
    manager: manager = false,
    url: url,
    data: data,
    param: param = undefined
}) => {
    let requestConfig = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    const BASE_URL = '/api/'
    switch (method) {
        case "GET":
            try {
                const response = await axios.get(
                    `${BASE_URL}${url}`,
                    auth ? requestConfig : undefined,
                    param ? { params: param } : undefined,
                )
                return response['data']
            } catch (err) {
                alert(err)
            }
            break
        case "POST":
            try {
                return await axios.post(`${BASE_URL}${url}`, data, requestConfig)
            } catch (error) {
                console.log(error.response)
            }
            break
        case "PUT":
            try {
                return await axios.put(`${BASE_URL}${url}`, data, requestConfig)
            } catch (err) {
                alert(err)
            }
            break
        case "PATCH":
            try {
                return await axios.patch(`${BASE_URL}${url}`, data, requestConfig)
            } catch (err) {
                alert(err)
            }
            break
        case "DELETE":
            try {
                return await axios.delete(`${BASE_URL}${url}`, requestConfig)
            } catch (err) {
                alert(err)
            }
            break

    }
}

const showSnackbar = (text, color = undefined) => {
    $("#snackbar").empty()
    if (color) {
        $("#snackbar").css('background-color', color)
    }
    $("#snackbar").append(`
        <strong>${text}</strong>
    `)
    $("#snackbar").css('bottom', '0')
    setTimeout(() => {
        $("#snackbar").css('bottom', '-60px')
    }, 2500)
}