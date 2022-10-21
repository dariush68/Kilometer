let pageURL = window.location.href
let URLArray = pageURL.split('/')
let productID = URLArray[URLArray.length - 2]
let priceID = ''


const getProduct = () => {

    axios.get(`/api/store/ware/${productID}`)
        .then(response => {
            let product = response.data
            let variants = product['product']
            let productPics = product['picture']
            let priceStr = numeral(product.price).format('0,0')
            productPics.sort(pic => pic['ordering'])
            productPics.sort((a, b) => a['ordering'] - b['ordering'])
            let productFeatures = JSON.parse(product.info)
            $("#product-title").text(product.name)
            $("#review-product-title").text(product.name)
            $("#features-product-name").text(product.name)
            $("#comment-product-name").text(product.name)
            $("#page-title").text(product.name)
            $("#product-brand").text(product['brand']['name'])
            if (product['sub_sub_category']) {
                $("#product-sub-category").text(product['sub_sub_category'].name)
                $("#product-sub-category").attr('href', `/category/${product['sub_sub_category'].slug}`)
            } else {
                $("#product-sub-category").text(product['sub_category'].name)
                $("#product-sub-category").attr('href', `/category/${product['sub_category'].slug}`)
            }


            $("#bread-cat span").text(product['sub_sub_category']['sub_category']['category'].name)
            $("#bread-cat").attr('href', `/category/${product['sub_sub_category']['sub_category'].category.slug}`)
            $("#bread-sub-cat span").text(product['sub_sub_category']['sub_category'].name)
            $("#bread-sub-cat").attr('href', `/category/${product['sub_sub_category']['sub_category'].slug}`)
            $("#bread-product span").text(product.name)

            $("#product-price").text(priceStr)
            $("#product-off").text(product['off'])
            $("#product-review").append(product['criticism'])

            variants.map(variant => {
                let colorCode = `#${variant.color['hex_code']}`

                $("#product-variants").append(`
                    <div class="color-box ml-2 rounded d-flex px-3 py-1" productID="${variant.id}" price="${variant.price}" id="color-box-${variant.id}" onclick="changePrice($(this))"  
                         style="width: fit-content; cursor: pointer">
                        <div class="color-background" style="background-color: ${colorCode}">
                            
                        </div>
                        <div class="mr-2">
                            <span>${variant.color['name']}</span>
                        </div>
                    </div>
                `)
                if (variant.default) {
                    $(`#color-box-${variant.id}`).addClass('active-color')
                    priceID = variant.id
                }
            })

            productFeatures.map((featureCategory, index) => {
                $("#product-features-box").append(`
                    <section class="w-100">
                        <h3 class="params-title">${featureCategory['category_name']}</h3>
                        <ul class="params-list" id="feature-params-${index}">
                            
                        </ul>
                    </section>
                `)

                featureCategory['features'].map(feature => {
                    $(`#feature-params-${index}`).append(`
                        <li>
                            <div class="row mx-0">
                                <div class="params-list-key bg-light py-2 px-4 col-12 col-sm-5 col-md-3 col-lg-2">
                                    <span class="block">${Object.keys(feature)}</span>
                                </div>
                                <div class="params-list-value bg-light py-2 px-4 col-12 col-sm-6 col-md-8 col-lg-9">
                                    <span class="block">
                                        ${feature[Object.keys(feature)]}
                                    </span>
                                </div>
                            </div>
                        </li>
                    `)
                })

            })
            $("#product-gallery").append(`
                <img class="zoom-img" id="img-product-zoom" src="${productPics[0]['picture']}" 
                    data-zoom-image="${productPics[0]['picture']}" alt="thumbnail" style="width: 92%!important; max-height: 400px" height="fit-content">
                <div id="gallery_01f" style="width:500px; float:left">
                    <ul class="gallery-items" id="gallery-slider">
                        
                    </ul>
                </div>
            `)
            $("#gallery-slider").append(`
                <li class="item">
                    <a href="#" class="elevatezoom-gallery active" data-update=""
                        data-image="${productPics[0]['picture']}"
                        data-zoom-image="${productPics[0]['picture']}">
                        <img src="${productPics[0]['picture']}" width="100" alt="${productPics[0]['id']}"/></a>
                </li>
            `)
            for (let i = 1; i < productPics.length; i++) {
                $("#gallery-slider").append(`
                    <li class="item">
                        <a href="#" class="elevatezoom-gallery" data-update=""
                            data-image="${productPics[i]['picture']}"
                            data-zoom-image="${productPics[i]['picture']}">
                            <img src="${productPics[i]['picture']}" width="100" alt="${productPics[0]['id']}"/></a>
                    </li>
                `)
            }
            $("#img-product-zoom").ezPlus({
                zoomType: "inner",
                containLensZoom: true,
                gallery: 'gallery_01f',
                cursor: "crosshair",
                galleryActiveClass: "active",
                responsive: true,
                imageCrossfade: true,
                zoomWindowFadeIn: 500,
                zoomWindowFadeOut: 500
            });

        })
        .catch(error => {
            console.log(error)
        })
}
getProduct()


const changePrice = (radio) => {
    radio.addClass('active-color')
    radio.siblings().removeClass('active-color')
    priceID = radio.attr('productID')
    let priceStr = numeral(radio.attr('price')).format('0,0')
    $("#product-price").text(priceStr)
    // $('input:radio[name="variant-color"]').change(() => {
    //     console.log($(this))
    // })
}
// console.log(productID)

let userRating = 0
const productRate = (rating) => {
    let userRate = rating.attr('data-rating');
    let children = $("#user-rating-stars-box").children()
    children.css('color', 'black')
    children.removeClass('fa-star').addClass('fa-star-o')
    for (let i = 0; i < userRate; i++) {
        children.eq(i).removeClass('fa-star-o').addClass('fa-star');
        children.eq(i).css('color', '#ffd700');
    }
    userRating = userRate
}
// $(".rating-star").click(() => {
//     console.log($(this).attr('class'))
// })

const jalaliDate = (date) => {
    let month = 0
    let arrayDate = date.split('-');
    if (arrayDate[1] < 10) {
        month = arrayDate[1].substring(1)
    } else {
        month = arrayDate[1]
    }
    let months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',]
    return `${arrayDate[2]} ${months[month - 1]} ${arrayDate[0]}`
}

const getProductComments = () => {
    let data = {
        params: {
            ware: productID
        }
    }
    axios.get(`/api/store/comment/`, data)
        .then(response => {
            let comments = response.data.results
            // console.log(JSON.stringify(comments))
            $("#num-of-comments").text(comments.length + ' نظر ')
            $("#comments-list").empty()
            comments.reverse()
            comments.map(cm => {
                let date = cm['created_on']
                let shamsi = moment(date, 'YYYY-MM-DD').locale('fa').format('YYYY-MM-DD');
                let commentDate = jalaliDate(shamsi)
                $("#comments-list").append(`
                    <li class="w-100">
                        <div class="comment-body">
                            <div class="row">
                                <div class="col-md-3 col-sm-12">
                                    <div class="message-light message-light--opinion-positive">
                                        <span>نمره کاربر به محصول: </span>
                                        <div id="user-rate-${cm.id}">

                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-9 col-sm-12 comment-content">
                                    <div class="comment-author">
                                        توسط
                                         ${cm.user.name}
                                         در تاریخ
                                         ${commentDate}
                                    </div>

                                    <p>${cm.body}</p>
                                </div>
                            </div>
                        </div>
                    </li>
                `)
                let userRate = cm['star']
                for (let i = 0; i < 5; i++) {
                    if (i < userRate) {
                        $(`#user-rate-${cm.id}`).append(`
                            <span style="font-size: 18px; color: #ffd700" class="rating-star fa fa-star" data-rating="${i}"></span>
                        `)
                    } else {
                        $(`#user-rate-${cm.id}`).append(`
                            <span style="font-size: 18px;" class="rating-star fa fa-star-o" data-rating="${i}"></span>
                        `)
                    }
                }

            })
        })
        .catch(error => {
            console.log(error)
        })
}

getProductComments()

$("#add-comment-btn").click(() => {
    let token = localStorage.getItem('accessToken')

    if (token === '' || token === null) {
        localStorage.setItem('thisPageURL', window.location.href);
        window.location.href = '/profile/login/'
        console.log('login')
    } else {
        let rate = userRating
        let comment = $("#user-comment").val()
        let config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
        }
        let data = {
            ware: productID,
            star: rate,
            body: comment
        }
        axios.post(`/api/store/comment/`, data, config)
            .then(response => {
                // console.log(response)
                if (response.status === 201) {
                    getProductComments()
                }
            })
            .catch(error => {
                console.log(error.response)
            })

    }
})


const addProductToFavorites = () => {
    localStorage.setItem('thisPageURL', window.location.href)
    if (localStorage.getItem('accessToken') === null || localStorage.getItem('accessToken') === '') {
        window.location.href = '/profile/login'
    } else {
        let config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
        }
        let data = {
            ware: productID
        }
        axios.post(`/api/user/favorite-ware/`, data, config)
            .then(response => {
                console.log(response)
                if (response.status === 201) {
                    $("#add-product-to-favorites").css('color', 'red')
                }
            })
            .catch(error => {
                $("#snackbar").empty()
                $("#snackbar").append(`
                    <strong>${error.response.data.error.message}</strong>
                `)
                $("#snackbar").css('bottom', '0')
                setTimeout(() => {
                    $("#snackbar").css('bottom', '-60px')
                }, 2500)
            })
    }
}

function addProductToCart() {
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    let data = {
        product: priceID,
        quantity: 1
    }
    if (localStorage.getItem('accessToken')) {
        axios.post('/api/store/cart/', data, config)
        .then(response => {
            console.log(response)
            if (response.status === 201) {
                $("#product-added-to-cart").modal('show')
                updateCart()
            }
        })
        .catch(error => {
            console.log(error)
        })
    } else {
        $("#snackbar").empty()
        $("#snackbar").append(`
            <strong>برای افزودن محصول به سبد خرید میبایست وارد حساب کاربری خود شوید</strong>
        `)
        $("#snackbar").css('bottom', '0px')
        setTimeout(() => {
            $("#snackbar").css('bottom', '-60px')
        }, 3500)
    }
}