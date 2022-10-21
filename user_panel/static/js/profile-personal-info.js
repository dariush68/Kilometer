const getUserInfo = () => {
    let config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
    }
    axios.get('/api/user/info', config)
        .then(response => {
            // console.log(JSON.stringify(response.data))
            let personalInfo = response.data;

            userGroups = personalInfo['groups']
            // $("#profile-name").text(personalInfo['first_name'] + ' ' + personalInfo['last_name'])

            $("#personal-info-name").text(personalInfo['name'])
            $("#personal-info-national-code").text(personalInfo['national_code'])
            $("#personal-info-phone-number").text(personalInfo['phone_number'])
            $("#personal-info-bank").text(personalInfo['bank_card_number'])
            $("#personal-info-email").text(personalInfo['email'])
        })
        .catch(error => {
            console.log('Error accrued: ', error.message)
        })
}

window.onload = getUserInfo
