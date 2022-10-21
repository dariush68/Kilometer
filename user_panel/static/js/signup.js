const signup = () => {
    $("#signup-username").css('border', '1px solid #c8c8c8')
    $("#signup-password").css('border', '1px solid #c8c8c8')
    let phone_number = $("#signup-username").val();
    localStorage.setItem('userPhoneNumber', phone_number)
    let password = $("#signup-password").val();
    let isRulesChecked = $("#signup-rules").prop('checked')
    let isPhoneNumber = false
    let isPassword = false
    let phoneRegex = /^(09[0-3]+[0-9]*)$/i;

    if (phoneRegex.test(phone_number) && (phone_number.length === 10 || phone_number.length === 11)) {
        isPhoneNumber = true
    }

    if (password.length >= 8) {
        isPassword = true
    }

    if (!isPhoneNumber) {
        $("#signup-username").css('border', '1px solid red')
    }
    if (!isPassword) {
        $("#signup-password").css('border', '1px solid red')
    }
    if (isPhoneNumber && isRulesChecked && isPassword) {
        let config = {
            password: password,
            phone_number: phone_number,
        }
        $("#loading-backdrop").css('display', 'unset')
        axios.post('/api/user/signup/', config)
            .then(async response => {
                if (response.status === 200) {
                    let signupStatus = await tokenGenerator(phone_number, password)
                    if (signupStatus.status === 200) {
                        localStorage.setItem('accessToken', signupStatus.data.access)
                        localStorage.setItem('refreshToken', signupStatus.data.refresh)
                        console.log(localStorage.getItem('accessToken'))
                        $("#loading-backdrop").css('display', 'none')
                        window.location.href = `/profile/verify-phone-number?phone_number=${phone_number}`
                    } else {
                        console.log(signupStatus)
                    }
                }
            })
            .catch(error => {
                const key = Object.keys(error.response.data)
                $("#loading-backdrop").css('display', 'none')
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
}
