const changePassword = () => {
    $("#password-error-box").empty()
    let currentPassword = $("#current-password").val()
    let newPassword = $("#new-password").val()
    let newPasswordAgain = $("#new-password-again").val()

    if (newPassword !== newPasswordAgain) {
        $("#password-error-box").append(`
            <span style="color: red">رمز عبور جدید، همخوانی ندارد!</span>
        `)
    } else if (newPassword.length < 8) {
        $("#password-error-box").append(`
            <span style="color: red">طول رمز عبور نباید کمتر از 8 باشد!</span>
        `)
    }
    else {
        let config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        }
        let data = {
            old_password: currentPassword,
            new_password: newPassword
        }
        axios.put('/api/user/change-password/', data, config)
            .then(response => {
                if (response.status === 200) {
                    localStorage.setItem('accessToken', '')
                    window.location.href = '/profile/login/'
                }
            })
            .catch(error => {
                if (error.response.status === 400) {
                    let errorMessage = error.response.data
                    $("#password-error-box").append(`
                        <span style="color: red">${errorMessage.old_password[0]}</span>
                    `)
                }
            })
    }
}

$("#show-current-password").click(() => {
    if ($("#show-current-password").hasClass('fa-eye-slash')) {
        $("#current-password").attr('type', 'text')
        $("#show-current-password").removeClass('fa-eye-slash').addClass('fa-eye')
    } else {
        $("#current-password").attr('type', 'password')
        $("#show-current-password").removeClass('fa-eye').addClass('fa-eye-slash')
    }
})
$("#show-new-password").click(() => {
    if ($("#show-new-password").hasClass('fa-eye-slash')) {
        $("#new-password").attr('type', 'text')
        $("#show-new-password").removeClass('fa-eye-slash').addClass('fa-eye')
    } else {
        $("#new-password").attr('type', 'password')
        $("#show-new-password").removeClass('fa-eye').addClass('fa-eye-slash')
    }
})
$("#show-new-password-again").click(() => {
    if ($("#show-new-password-again").hasClass('fa-eye-slash')) {
        $("#new-password-again").attr('type', 'text')
        $("#show-new-password-again").removeClass('fa-eye-slash').addClass('fa-eye')
    } else {
        $("#new-password-again").attr('type', 'password')
        $("#show-new-password-again").removeClass('fa-eye').addClass('fa-eye-slash')
    }
})