
const getCartItems = async () => {
    $("#cart-items-tbody").empty()
    $("#cart-price-details").empty()
    const response = await sendRequest({
        method: 'GET',
        url: 'store/cart/',
        auth: true
    })
    if (response) {
        let cartItems = response
        let totalPrice = 0
        if (cartItems.length === 0) {
            $("#cart-items-tbody").append(`
                <div class="mt-3">
                    <h6 class="mx-auto d-flex w-100 justify-content-center" style="font-size: 18px">سبد خرید شما خالی است</h6>
                    <div class="d-flex w-100 justify-content-center  mt-4">
                        <a href="/" class="btn btn-primary">بازگشت  به فروشگاه</a>
                    </div>
                </div>
            `)
        }
        cartItems.map(item => {
            totalPrice += (item['product']['price'] * item['quantity'])
            $("#cart-items-tbody").append(`
                <tr class="checkout-item">
                    <td>
                        <button class="checkout-btn-remove mr-2" onclick="removeProductFromCart(${item.id})"></button>
                    </td>
                    <td>
                        <img src="${item['product']['ware']['thumbnail']}" alt="" style="max-width: 100px">
                    </td>
                    <td class="d-flex align-items-center justify-content-center">
                        <strong class="checkout-title mt-3">
                            ${item['product']['ware']['name']}
                        </strong>
                    </td>
                    <td>
                        <span class="text-muted" style="font-size: 12px; margin-top: -10px">
                            رنگ ${item['product']['color']['name']}
                        </span>
                    </td>
                    <td>
                        <div class="d-flex justify-content-between align-items-center px-2 py-1 border rounded">
                            <i style="color: grey; cursor: pointer" class="fa fa-plus ml-2" onclick="incrementQuantity(${item.id})"></i>
                            <span class="w-100" price="${item['product']['price']}" id="quantity-${item.id}">${item['quantity']}</span>
                            <i style="color: grey; cursor: pointer" class="fa fa-minus mr-2" onclick="decrementQuantity(${item.id})"></i>
                        </div>
                    </td>
                    <td id="price-${item.id}">${numeral(item['product']['price'] * item['quantity']).format('0,0')} تومان</td>
                </tr>
            `)

        })
        $("#cart-price-details").append(`
            <span>
            مبلغ کل (${cartItems.length} کالا)    
            </span>
            <span>
                ${numeral(totalPrice).format('0,0')} تومان
            </span>
        `)
        $(".checkout-summary-price-value-amount").text(numeral(totalPrice).format('0,0'))
    }
}
getCartItems()

const incrementQuantity = async (itemID) => {
    let currentQuantity = $(`#quantity-${itemID}`).text()
    let data = {
        quantity: parseInt(currentQuantity) + 1
    }
    const response = await sendRequest({
        method: 'PATCH',
        url: `store/cart/${itemID}/`,
        data: data,
    })
    if (response) {
        await getCartItems()
    }
}
const decrementQuantity = async (itemID) => {
    let currentQuantity = $(`#quantity-${itemID}`).text()
    if (currentQuantity > 1) {
        let data = {
            quantity: parseInt(currentQuantity) - 1
        }
        const response = await sendRequest({
            method: 'PATCH',
            url: `store/cart/${itemID}/`,
            data: data,
            auth: true
        })
        if (response) {
            await getCartItems()
        }
    }

}


const removeProductFromCart = async (itemID) => {
    const response = await sendRequest({
        method: 'DELETE',
        url: `store/cart/${itemID}`,
    })
    if (response) {
        await getCartItems()
    }
}