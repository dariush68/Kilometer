let userGroups = ''
const getUserInfo = () => {
    let config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
    }
    axios.get('/api/user/info', config)
        .then(response => {
            // console.log(JSON.stringify(response))
            let personalInfo = response.data;

            userGroups = personalInfo['groups']
            // $("#profile-name").text(personalInfo['first_name'] + ' ' + personalInfo['last_name'])

            $("#profile-name").val(personalInfo['name'])
            $("#profile-national-code").val(personalInfo['national_code'])
            $("#profile-phone_number").val(personalInfo['phone_number'])
            $("#profile-bank-card-number").val(personalInfo['bank_card_number'])
            $("#profile-email-address").val(personalInfo['email'])
            $("#is-foreign").attr('checked', personalInfo['is_foreign_people'])

        })
        .catch(error => {
            console.log('Error accrued: ', error.message)
        })
}

window.onload = getUserInfo

const updatePersonalInfo = () => {
    $("#errors-box").empty()

    let name = $("#profile-name").val()
    let nationalCode = $("#profile-national-code").val()
    let phoneNumber = $("#profile-phone_number").val()
    let bankCardNumber = $("#profile-bank-card-number").val()
    let emailAddress = $("#profile-email-address").val()
    let isForeign = $("#is-foreign").prop('checked')

    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    let data = {
        username: phoneNumber,
        phone_number: phoneNumber,
        name: name,
        national_code: nationalCode,
        bank_card_number: bankCardNumber,
        is_verified: false,
        is_foreign_people: isForeign,
        groups: userGroups,
        email: emailAddress
    }


    axios.put('/api/user/info/', data, config)
        .then(response => {
            console.log(response)
            if (response.status === 200) {
                window.location.href = '/profile';
            }
        })
        .catch(error=> {
            // console.log(error.response.data)
            let err = error.response.data
            let errorTxt = Object.keys(err)
            errorTxt.map(txt => {
                switch (txt) {
                    case 'name':
                        $("#errors-box").append(`
                            <span class="d-block my-2" style="font-size: 12px">${err['name'][0]}</span>
                        `)
                        $("#profile-name").css('border-color', 'red')
                        break
                    case 'national_code':
                        $("#errors-box").append(`
                            <span class="d-block my-2" style="font-size: 12px">${err['national_code'][0]}</span>
                        `)
                        $("#profile-national-code").css('border-color', 'red')
                        break
                    case 'bank_card_number':
                        $("#errors-box").append(`
                            <span class="d-block my-2" style="font-size: 12px">${err['bank_card_number'][0]}</span>
                        `)
                        $("#profile-bank-card-number").css('border-color', 'red')
                        break
                    case 'phone_number':
                        $("#errors-box").append(`
                            <span class="d-block my-2" style="font-size: 12px">${err['phone_number'][0]}</span>
                        `)
                        $("#profile-phone_number").css('border-color', 'red')
                        break
                    case 'email':
                        $("#errors-box").append(`
                            <span class="d-block my-2" style="font-size: 12px">${err['email'][0]}</span>
                        `)
                        $("#profile-email-address").css('border-color', 'red')
                        break
                }
            })
        })

}