// alert('login')

const login = async () => {
    $("#login-failed-error").empty()
    let username = $("#login-username").val();
    let password = $("#login-password").val();
    $("#loading-backdrop").css('display', 'unset')
    const loginStatus = await tokenGenerator(username, password)
    $("#loading-backdrop").css('display', 'none')
    if (loginStatus.status === 401) {
        $("#login-failed-error").append(`
            <strong class="alert alert-danger w-100 text-center">اطلاعات ورودی نادرست میباشند</strong>
        `)
    } else if (loginStatus.status === 200) {
        localStorage.setItem('accessToken', loginStatus.data.access)
        localStorage.setItem('refreshToken', loginStatus.data.refresh)
        window.location.href = localStorage.getItem('thisPageURL')
    }
    // window.location.href = localStorage.getItem('thisPageURL')


}

