const forgotPassword = () => {
    let phoneNumber = $("#phone-number").val()
    let formData = new FormData();
    formData.append('phone_number', phoneNumber)
    axios.post('/api/store/forget-password/', formData)
        .then(response => {
        })
        .catch(error => {
            const key = Object.keys(error.response.data)
            $("#snackbar").empty()
            $("#snackbar").append(`
                <strong>${error.response.data[key[0]]}</strong>
            `)
            $("#snackbar").css('bottom', '0')
            setTimeout(() => {
                $("#snackbar").css('bottom', '-60px')
            }, 2500)
        })
}