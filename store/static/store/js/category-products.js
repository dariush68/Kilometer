let URL = window.location.href.split("/")
let categoryID = URL[4]

const getCategoriesInfo = async () => {
    const response = await sendRequest({
        method: 'GET',
        url: `store/category/${categoryID}`
    })
    if (response) {
        $("#page-title").text(response.data.name)
        $("#cat-name").text(response.data.name)
        const type = response.type
        const subCats = response.data['subcategory']
        appendSubCats(subCats)
        const wareRes = await sendRequest({
            method: 'GET',
            url: `store/category/${categoryID}/ware`
        })
        if (wareRes) {
            appendProducts(response.data.name, wareRes)
        }
    }
}
getCategoriesInfo()

const appendSubCats = (subCats) => {
    subCats.map(sub => {
        $("#this-cat-subs-container").append(`
            <div class="sub-category-box">
                <a href="/category/${sub['slug']}">
                    <img src="${sub.image}" alt="${sub.name}">
                    <div><strong>${sub.name}</strong></div>
                </a>
            </div>
        `)
    })
}

const appendProducts = (catName, products) => {
    $("#category-name").text(`آخرین محصولات ${catName}`)
    products.map(ware => {
        $("#category-last-products").append(`
            <a class="item" href="/product/${ware.id}/${ware['slug']}" style="min-height: 350px">
                <img src="${ware.thumbnail}" class="img-fluid" style="min-height: 180px; max-height: 180px; object-fit: cover;" alt="${ware.name}">
                <h2 class="post-title">
                    <strong>${ware.name}</strong>
                </h2>
                <div class="price">
                    <div class="text-center">
                        <ins><span>${numeral(ware.price).format('0,0')}<span> تومان</span></span></ins>
                    </div>
                </div>
            </a>
        `)
    })
    $(`#category-last-products`).owlCarousel({
        rtl: true,
        margin: 10,
        nav: true,
        navText: ['<i class="now-ui-icons arrows-1_minimal-right"></i>', '<i class="now-ui-icons arrows-1_minimal-left"></i>'],
        dots: false,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                slideBy: 1
            },
            576: {
                items: 2,
                slideBy: 1
            },
            768: {
                items: 3,
                slideBy: 2
            },
            992: {
                items: 3,
                slideBy: 2
            },
            1400: {
                items: 4,
                slideBy: 3
            }
        }
    });
}