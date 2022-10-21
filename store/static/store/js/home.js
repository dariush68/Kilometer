const getCategories = () => {
    // $("#top-products-container").empty()
    axios.get('/api/store/category')
        .then(response => {
            const categories = response.data.results
            categories.map(cat => {
                cat['subcategory'].map(sub => {
                    $("#top-products-container").append(`
                        <div class="row" id="products-${sub.id}-container">
                            <div class="col-12">
                                <div class="widget widget-product card">
                                    <header class="card-header">
                                        <h3 class="card-title">
                                            <span>${sub.name}</span>
                                        </h3>
                                        <a href="/sub-category/${sub.id}/" class="view-all">مشاهده همه</a>
                                    </header>
                                    <div class="product-carousel owl-carousel owl-theme" id="sub-${sub.id}-products">
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    `)
                    axios.get(`/api/store/sub-category/${sub.id}/ware/`)
                        .then(res => {
                            if (res.data.results.length > 0) {
                                res.data.results.forEach(ware => {
                                    $(`#sub-${sub.id}-products`).append(`
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
                                $(`#sub-${sub.id}-products`).owlCarousel({
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
                            } else {
                                $(`#products-${sub.id}-container`).remove()
                            }
                        })
                })
            })
        })
        .catch(error => {
            console.error(error)
        })
}
getCategories()

const getSlideshows = async () => {
    const response = await sendRequest({
        method: 'GET',
        url: 'store/slide-show'
    })
    if (response) {
        response.forEach((slide, index) => {
            $("#main-slideshow-container").append(`
                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                    <a class="d-block" href="${slide.link}">
                        <img src="${slide.image}"
                            class="d-block w-100" alt="" style="max-height: 420px; object-fit: cover">
                    </a>
                </div>
            `)
            $("#slideshow-indicators-container").append(`
                <li data-target="#main-slideshow-container" data-slide-to="${index}" class="${index === 0 ? 'active' : ''}"></li>
            `)
        })
    }
}
getSlideshows()