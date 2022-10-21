const getUserInfo = () => {
    let config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
    }
    axios.get('/api/manager/info', config)
        .then(response => {
            // console.log(JSON.stringify(response.data))
            let personalInfo = response.data;

            $("#management-panel-name").text(personalInfo['name'])
            $("#management-panel-national-code").text(personalInfo['national_code'])
            $("#management-panel-phone").text(personalInfo['phone_number'])
            $("#management-panel-bank-card-number").text(personalInfo['bank_card_number'])
            $("#management-panel-email").text(personalInfo['email'])
        })
        .catch(error => {
            console.log('Error accrued: ', error.response)
        })
}

window.onload = getUserInfo