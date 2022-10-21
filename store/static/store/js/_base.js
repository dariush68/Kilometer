if (localStorage.getItem('accessToken') !== '' && localStorage.getItem('accessToken') !== null) {
    let data = {
        token: localStorage.getItem('accessToken')
    }
    axios.post('/api/token/verify/', data)
        .then(response => {
            // console.log('verify: ', response)
            if (response.status === 200) {
                $("#navbarDropdownMenuLink1").text('پروفایل   ')
                $("#login-btn").addClass('d-none')
                $("#logout-btn").removeClass('d-none')
                $("#signup-btn").addClass('d-none')
            }
        })
        .catch(async error => {
            if (error.response.status === 401) {
                const newTokenResponse = await newTokenGenerator()
                if (newTokenResponse.status === 200) {
                    localStorage.setItem('accessToken', newTokenResponse.data.access)
                    $("#navbarDropdownMenuLink1").text('پروفایل   ')
                    $("#login-btn").addClass('d-none')
                    $("#logout-btn").removeClass('d-none')
                    $("#signup-btn").addClass('d-none')
                } else {
                    localStorage.setItem('accessToken', '')
                    $("#navbarDropdownMenuLink1").text('ورود/ثبت نام   ')
                    $("#logout-btn").addClass('d-none')
                    $("#profile-btn").addClass('d-none')
                    $("#order-btn").addClass('d-none')
                }
            }
        })

} else {
    $("#navbarDropdownMenuLink1").text('ورود/ثبت نام   ')
    $("#logout-btn").addClass('d-none')
    $("#profile-btn").addClass('d-none')
    $("#order-btn").addClass('d-none')
}

const isUserLogin = async () => {
    let token = localStorage.getItem('accessToken')

    if (token === '') {
        $("#profile-btn").attr('href', '/profile/login/')
        $("#login-btn-mobile").attr('href', '/profile/login/')
        window.location.href = '/profile/login/'
    } else {
        const response = await sendRequest({
            method: 'GET',
            url: 'user/isAdmin/',
            auth: true,
        })
        if (response) {
            if (response['isManager']) {
                $("#profile-btn").attr('href', '/management-panel')
                $("#login-btn-mobile").attr('href', '/management-panel')
                window.location.href = '/management-panel'
            } else {
                $("#profile-btn").attr('href', '/profile')
                $("#login-btn-mobile").attr('href', '/profile')
                window.location.href = '/profile'
            }
        }
    }
}

const loginPermission = () => {
    let URL = window.location.href
    if (URL.split('/')[3] === 'profile' && localStorage.getItem('accessToken') === '') {
        window.location.href = '/profile/login'
    }
}
loginPermission()



const getCategoriesList = async () => {
    const response = await sendRequest({
        method: 'GET',
        url: 'store/category',
        auth: false,
    })
    if (response) {
        let categories = response.results
        categories.map(category => {
            $("#main-list").append(`
                <li class="list-item list-item-has-children mega-menu mega-menu-col-5">
                    <a class="nav-link" href="/category/${category['slug']}/">${category.name}</a>
                    <ul class="sub-menu nav" id="sub-categories-of-${category.id}">

                    </ul>
                </li>
            `)
            $("#responsive-menu").append(`
                <li class="sub-menu res-sub-menu">
                    <a href="/category/${category['slug']}/">${category.name}</a>
                    <ul id="responsive-sub-of-${category.id}">

                    </ul>
                </li>
            `)
            category['subcategory'].map(sub => {
                $(`#sub-categories-of-${category.id}`).append(`
                    <li class="list-item list-item-has-children">
                        <a href="/category/${sub['slug']}/" class="main-list-item nav-link" >${sub.name}</a>
                        <ul class="sub-menu nav" id="sub-sub-categories-of-${sub.id}">

                        </ul>
                    </li>
                `)
                $(`#responsive-sub-of-${category.id}`).append(`
                    <li class="">
                        <a href="/category/${sub['slug']}/">${sub.name}</a>
                        <ul id="responsive-sub-sub-categories-of-${sub.id}">

                        </ul>
                    </li>
                `)
                sub['subsubcategory'].map(subSub => {
                    $(`#sub-sub-categories-of-${sub.id}`).append(`
                        <li class="list-item">
                            <a class="nav-link" href="/category/${subSub['slug']}/">${subSub.name}</a>
                        </li>
                    `)
                    $(`#responsive-sub-sub-categories-of-${sub.id}`).append(`
                        <li>
                            <a href="/category/${subSub['slug']}/">${subSub.name}</a>
                        </li>
                    `)
                })
            })
        })
        $('nav.header-responsive li.active').addClass('open').children('ul').show();

        $("ul.res-menu > li.sub-menu > a").on('click', function () {
            $(this).removeAttr('href');
            let e = $(this).parent('li');
            if (e.hasClass('open')) {
                e.removeClass('open');
                e.find('li').removeClass('open');
                e.find('ul').slideUp(400);

            } else {
                e.addClass('open');
                e.children('ul').slideDown(400);
                e.siblings('li').children('ul').slideUp(400);
                e.siblings('li').removeClass('open');
            }
        });
    }
}
getCategoriesList()

const updateCart = async () => {
    $("#cart-items-list").empty()
    if (localStorage.getItem('accessToken')) {
        const response = await sendRequest({
            method: 'GET',
            auth: true,
            url: 'store/cart/',
        })
        if (response) {
            let cartList = response
            let totalPrice = 0
            if (cartList.length > 0) {
                $("#cart-items-count").css('display', 'inline-block')
                $("#cart-items-count").text(cartList.length)
                $("#submit-cart").css('display', 'unset')
            } else {
                $("#cart-items-count").css('display', 'none')
                $("#cart-items-list").append(`
                    <div class="w-100 d-flex justify-content-center my-4"><span>سبد شما خالی است</span></div>
                `)
                $("#submit-cart").css('display', 'none')
            }

            cartList.map(item => {
                totalPrice += item['product']['price']
                $("#cart-items-list").append(`
                    <li>
                        <div class="basket-item">
                            <button class="basket-item-remove" onclick="deleteProductFromCart(${item.id})"></button>
                            <div class="basket-item-content row mx-0">
                                <div class="basket-item-image col-3">
                                    <img class="w-100" alt="" src="${item['product']['ware']['thumbnail']}">
                                </div>
                                <div class="basket-item-details col-9">
                                    <a href="/product/${item['product']['ware']['id']}/${item['product']['ware']['slug']}" class="basket-item-title text-right float-right">
                                        ${item['product']['ware']['name']}
                                    </a>
                                    <div class="basket-item-params">
                                        <div class="basket-item-props">
                                            <span>
                                             ${item['quantity']} عدد
                                             </span>
                                            <span>
                                            رنگ ${item['product']['color']['name']}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <hr class="w-100 my-1">
                `)
            })
            $("#total-cart-value-header").text(numeral(totalPrice).format('0,0'))
        }
    } else {
        $("#cart-dropdown").css('pointer-events', 'none')
    }
}
updateCart()

const deleteProductFromCart = async (itemID) => {
    const response = await sendRequest({
        method: 'DELETE',
        url: `store/cart/${itemID}/`,
        auth: true,
    })
    if (response) {
        await updateCart()
    }
}

const globalSearchHandler = () => {
    const key = event.keyCode
    const searchTxt = $("#gsearchsimple").val()
    if (key === 13) {
        globalSearch(searchTxt)
    }

}
const globalSearch = () => {
    const searchTxt = $("#gsearchsimple").val()
    if (searchTxt !== '') {
        window.location.href = `/global-search/products/?search=${searchTxt}`
    }
}

if (window.location.href.includes('/global-search/products/')) {
    const urlParams = new URLSearchParams(window.location.search);
    const searchedTxt = urlParams.get('search')
    $("#global-search-input").val(searchedTxt)
    $("#gsearchsimple").val(searchedTxt)
}