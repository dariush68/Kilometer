const urlParams = new URLSearchParams(window.location.search);
const searchedTxt = urlParams.get('search')
$("#page-title").text(`محصولات مرتبط با ${searchedTxt}`)

const getProductByGlobalSearch = () => {
    $("#loading-backdrop").css('display', 'flex')
    axios.get('/api/store/global-search/', { params: { search: searchedTxt } })
        .then(response => {
            let products = response.data.results
            if (products.length === 0) {
                $("#newest div ul").append(`
                    <div class="d-flex w-100 alert alert-danger my-4 mx-3 justify-content-center">
                        محصولی یافت نشد!
                    </div>
                `)

            }
            products.map(product => {
                $("#newest div ul").append(`
                    <li class="col-xl-3 col-lg-4 col-md-6 col-12 no-padding">
                        <div class="product-box">
                            <div
                                class="product-seller-details product-seller-details-item-grid">
                                <span class="product-main-seller"><span
                                        class="product-seller-details-label">فروشنده:
                                    </span>کالانگار</span>
                                <span class="product-seller-details-badge-container"></span>
                            </div>
                            <a class="product-box-img" href="/product/${product.id}/${product['slug']}">
                                <img src="${product['thumbnail']}" alt="">
                            </a>
                            <div class="product-box-content">
                                <div class="product-box-content-row">
                                    <div class="product-box-title">
                                        <a href="/product/${product.id}/${product['slug']}">
                                            ${product.name}
                                        </a>
                                    </div>
                                </div>
                                <div class="product-box-row product-box-row-price">
                                    <div class="price">
                                        <div class="price-value">
                                            <div class="price-value-wrapper">
                                                ${numeral(product.price).format('0,0')}
                                                <span class="price-currency">
                                                    تومان
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                `)
            })
            $("#loading-backdrop").css('display', 'none')
        })
}
getProductByGlobalSearch()


const filterProducts = (viewOrder) => {
    $("#loading-backdrop").css('display', 'flex')
    let orderingHash = viewOrder[0]['hash'].slice(1)
    $(`#${orderingHash} div ul`).empty()
    let ordering = ''
    switch (orderingHash) {
        case 'most-view':
            ordering = 'view'
            break
        case 'newest':
            ordering = 'newest'
            break
        case 'most-seller':
            ordering = 'sale'
            break
        case 'down-price':
            ordering = 'price'
            break
        case 'top-price':
            ordering = '-price'
            break
    }
    // let brand = null
    let search = $("#search-input").val()
    let data = {
        params: {
            search: searchedTxt,
            ordering: ordering
        }
    }
    history.replaceState({},'',`?search=${searchedTxt}&order=${orderingHash}`)
    axios.get(`/api/store/global-search/`, data)
        .then(response => {
            // console.log(response)
            let products = response.data.results
            if (products.length === 0) {
                $(`#${orderingHash} div ul`).append(`
                    <div class="d-flex w-100 mt-4 justify-content-center">
                        <h6 style="font-size: 16px">محصولی یافت نشد!</h6>
                    </div>
                `)
            }
            products.map(product => {
                $(`#${orderingHash} div ul`).append(`
                    <li class="col-xl-3 col-lg-4 col-md-6 col-12 no-padding">
                        <div class="product-box">
                            <div
                                class="product-seller-details product-seller-details-item-grid">
                                <span class="product-main-seller"><span
                                        class="product-seller-details-label">فروشنده:
                                    </span>کالانگار</span>
                                <span class="product-seller-details-badge-container"></span>
                            </div>
                            <a class="product-box-img" href="/product/${product.id}/${product['slug']}">
                                <img src="${product['thumbnail']}" alt="">
                            </a>
                            <div class="product-box-content">
                                <div class="product-box-content-row">
                                    <div class="product-box-title">
                                        <a href="/product/${product.id}/${product['slug']}">
                                            ${product.name}
                                        </a>
                                    </div>
                                </div>
                                <div class="product-box-row product-box-row-price">
                                    <div class="price">
                                        <div class="price-value">
                                            <div class="price-value-wrapper">
                                                ${numeral(product.price).format('0,0')}
                                                <span class="price-currency">
                                                    تومان
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                `)
            })
            $("#loading-backdrop").css('display', 'none')
        })
        .catch(error => {
            console.log(error)
        })
}