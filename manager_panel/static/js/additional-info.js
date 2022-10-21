const getManagerInfo = () => {
    let config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
    }
    axios.get('/api/manager/info', config)
        .then(response => {
            let managerInfo = response.data
            $("#manager-additional-name").val(managerInfo['name'])
            $("#manager-additional-email").val(managerInfo['email'])
            $("#manager-additional-phone-number").val(managerInfo['phone_number'])
            $("#manager-additional-national-code").val(managerInfo['national_code'])
            $("#manager-additional-bank-card-number").val(managerInfo['bank_card_number'])
        })
        .catch(error => {
            console.log(error)
        })
}

const updateManagerInfo = () => {
    $("#errors-box").empty()
    let config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
    }
    let data = {
        username: $("#manager-additional-phone-number").val(),
        name: $("#manager-additional-name").val(),
        email: $("#manager-additional-email").val(),
        phone_number: $("#manager-additional-phone-number").val(),
        national_code: $("#manager-additional-national-code").val(),
        bank_card_number: $("#manager-additional-bank-card-number").val(),
    }
    axios.put('/api/manager/info/', data, config)
        .then(response => {
            showSnackbar('تغییرات با موفقیت اعمال شد', '#43a047')
            setTimeout(() => {
                window.location.href = '/management-panel/'
            }, 2600)
        })
        .catch(error => {
            console.log(error.response)
            let err = error.response.data
            let errorTxt = Object.keys(err)
            // console.log(errorTxt)
            errorTxt.map(txt => {
                switch (txt) {
                    case 'name':
                        $("#errors-box").append(`
                            <span class="d-block my-2" style="font-size: 12px">${err['name'][0]}</span>
                        `)
                        $("#manager-additional-name").css('border-color', 'red')
                        break
                    case 'national_code':
                        $("#errors-box").append(`
                            <span class="d-block my-2" style="font-size: 12px">${err['national_code'][0]}</span>
                        `)
                        $("#manager-additional-national-code").css('border-color', 'red')
                        break
                    case 'bank_card_number':
                        $("#errors-box").append(`
                            <span class="d-block my-2" style="font-size: 12px">${err['bank_card_number'][0]}</span>
                        `)
                        $("#manager-additional-bank-card-number").css('border-color', 'red')
                        break
                    case 'phone_number':
                        $("#errors-box").append(`
                            <span class="d-block my-2" style="font-size: 12px">${err['phone_number'][0]}</span>
                        `)
                        $("#manager-additional-phone-number").css('border-color', 'red')
                        break
                    case 'email':
                        $("#errors-box").append(`
                            <span class="d-block my-2" style="font-size: 12px">${err['email'][0]}</span>
                        `)
                        $("#manager-additional-email").css('border-color', 'red')
                        break
                }
            })
        })
}

window.onload = getManagerInfo

