const getManagerInfo = async () => {
    const response = await sendRequest({
        method: 'GET',
        url: 'manager/info',
        auth: true
    })
    if (response) {
        $("#manager-name").text(response['name'])
        $("#manager-email").text(response['email'])
        $("#manager-phone-number").text(response['phone_number'])
        $("#manager-national-code").text(response['national_code'])
        $("#manager-bank-card-number").text(response['bank_card_number'])
    }
}
window.onload = getManagerInfo