let num1 = 0
let num2 = 0
let num3 = 0
let num4 = 0
let num5 = 0
let num6 = 0

let url_str = window.location.href
let url = new URL(url_str)
let phone_number = url.searchParams.get("phone_number")

$("#user-phone").text(' ' + phone_number + ' ')

let getNumVal = () => {
    num1 = $("#number-1").val()
    num2 = $("#number-2").val()
    num3 = $("#number-3").val()
    num4 = $("#number-4").val()
    num5 = $("#number-5").val()
    num6 = $("#number-6").val()
    let tokenCode = [num1, num2, num3, num4, num5, num6].join('')
    if (num1 !== '' && num2 !== '' && num3 !== '' && num4 !== '' && num5 !== '' && num6 !== '') {
        verifyPhoneNumber(tokenCode)
    }

}



const verifyPhoneNumber = (tokenArray) => {
    let data = {
        phone_number: phone_number,
        generated_token: tokenArray
    }
    console.log(tokenArray)
    axios.put('/api/user/verify-user/', data)
        .then(response => {
            console.log(response)
            if (response.status === 200) {
                window.location.href = $("#url-welcome").attr('url')
            }
        })
        .catch(error => {
            console.log(error.response)
        })
}

