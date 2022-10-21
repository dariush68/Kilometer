const getAddresses = () => {
    $("#my-addresses-container").empty()
    $("#no-address-found").addClass('d-none')
    const config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
    }
    axios.get('/api/user/address', config)
        .then(response => {
            const addresses = response.data
            if (addresses.length === 0) {
                $("#no-address-found").removeClass('d-none')
            } else {
                addresses.forEach(address => {
                    $("#my-addresses-container").append(`
                        <div style="position: relative">
                            <i class="fa fa-trash-o delete-old-address-icon" onclick="deleteAddress(${address.id})"></i>
                            <p>
                                <strong>آدرس: </strong>
                                <span style="font-size: 16px">${address.address}</span>
                            </p>
                            <span>
                                <strong>کد پستی: </strong>
                                ${address.postal_code}
                            </span>
                        </div>
                        <hr class="mx-5"/>
                    `)
                })
            }
        })
}
getAddresses()

const addNewAddress = () => {
    const numOfAddresses = $("#my-addresses-container").children().length
    $("#new-addresses-container").append(`
        <div class="address-${numOfAddresses}-container mb-4" style="position: relative">
            <i class="fa fa-times delete-address-icon" onclick="$(this).parent().remove()"></i> 
            <textarea placeholder="آدرس" class="address-textarea" rows="5" id="my-address-${numOfAddresses + 1}"></textarea>
            <div class="d-block d-sm-flex justify-content-between">
                <input placeholder="کد پستی" class="address-postal-code-input" id="postal-code-${numOfAddresses + 1}"/>
                <button class="btn btn-sm btn-info d-flex mr-auto" onclick="saveAddress(${numOfAddresses + 1})">
                    ثبت آدرس
                </button>
            </div>
            
            <hr />
        </div>
    `)
}

const saveAddress = (id) => {
    $("#snackbar").empty()
    const config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
    }
    const address = $(`#my-address-${id}`).val()
    const postalCode = $(`#postal-code-${id}`).val()
    if (address === '' || postalCode === '') {
        $("#snackbar").append(`
            <strong>لطفا آدرس و کد پستی را وارد کنید</strong>
        `)
        $("#snackbar").css('bottom', '0px')
        setTimeout(() => {
            $("#snackbar").css('bottom', '-60px')
        }, 2500)
    } else {
        const data = {
            address: address,
            postal_code: postalCode,
        }
        axios.post('/api/user/address/', data, config)
            .then(response => {
                if (response.status === 201) {
                    getAddresses()
                }
            })
    }
}

const deleteAddress = (id) => {
    const config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
    }
    axios.delete(`/api/user/address/${id}`, config)
        .then(response => {
            if (response.status === 204) {
                getAddresses()
            }
        })
}