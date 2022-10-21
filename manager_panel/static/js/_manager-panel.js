// Get Manager Info
const managerInfo = async () => {
    const response = await sendRequest({
        method: 'GET',
            auth: true,
            url: 'manager/info'
    })
    if (response) {
        $("#management-panel-name").text(response['name'])
        $("#management-panel-national-code").text(response['national_code'])
        $("#management-panel-phone").text(response['phone_number'])
        $("#management-panel-bank-card-number").text(response['bank_card_number'])
        $("#management-panel-email").text(response['email'])
    }
}
managerInfo()