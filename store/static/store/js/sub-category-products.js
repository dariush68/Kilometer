let URL = window.location.href.split("/")
let subCategoryID = URL[4]
// console.log(subCategoryID)


const getSubCatDetails = () => {
    $("#loading-backdrop").css('display', 'flex')
    axios.get(`/api/store/category/${subCategoryID}`)
        .then(response => {
            console.log(response)
            let data = response.data;
            let type = response.data.type
            if (type === 'sub-category') {
                $("#sub-sub-cats-container").css('display', 'block')
                $("#bread-cat").text(data.data['category'].name)
                $("#bread-sub-cat").text(data.data.name)
            } else {
                $("#bread-cat").text(data.data['sub_category'].name)
                $("#bread-sub-cat").text(data.data.name)
            }
            $("#page-title").text(`محصولات دسته ${data.data.name}`)
            $("#sub-cat-name").text(data.data.name)

            // let products = data.data.ware;
            if (type === 'sub-category') {
                const subSubCategories = response.data.data['subsubcategory']
                subSubCategories.map(sub => {
                    $("#this-sub-cat-subs-container").append(`
                        <div class="sub-category-box">
                            <a href="/category/${sub['slug']}">
                                <img src="${sub.image}" alt="${sub.name}">
                                <div><strong>${sub.name}</strong></div>
                            </a>
                        </div>
                    `)
                })
            }
            axios.get(`/api/store/category/${subCategoryID}/ware`)
                .then(res => {
                    $("#num-of-products").text(`${res.data.length} کالا`)
                    if (res.data.length > 0) {
                        res.data.map(product => {
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
                    } else {
                        $("#newest div ul").append(`
                            <div class="alert alert-warning w-100 text-center m-3">محصولی یافت نشد</div>
                        `)
                    }
                })
            $("#loading-backdrop").css('display', 'none')
            // const brands = response.data.brands
            // for (let i = 0; i < brands.length - 1; i++) {
            //     if (brands[i].id === brands[i + 1].id) {
            //         brands.splice(brands[i], 1)
            //     }
            // }
            // brands.map(brand => {
            //     $("#sub-cat-brands-container").append(`
            //         <div class="checkbox">
            //             <input id="brand-${brand.id}" type="checkbox">
            //             <label for="brand-${brand.id}">
            //                 ${brand.name}
            //             </label>
            //         </div>
            //     `)
            // })


            // console.log(JSON.stringify(products))

        })
        .catch(error => {
            console.log(error)
        })
}
getSubCatDetails()

// const getProducts = () => {
//     $("#loading-backdrop").css('display', 'flex')
//     axios.get(`/api/store/category/${subCategoryID}/ware`)
//         .then(response => {
//             // console.log(response)
//             let products = response.data.results
//             $("#num-of-products").text(`${products.length} کالا`)
//             products.map(product => {
//                 $("#newest div ul").append(`
//                     <li class="col-xl-3 col-lg-4 col-md-6 col-12 no-padding">
//                         <div class="product-box">
//                             <div
//                                 class="product-seller-details product-seller-details-item-grid">
//                                 <span class="product-main-seller"><span
//                                         class="product-seller-details-label">فروشنده:
//                                     </span>کالانگار</span>
//                                 <span class="product-seller-details-badge-container"></span>
//                             </div>
//                             <a class="product-box-img" href="/product/${product.id}/${product['slug']}">
//                                 <img src="${product['thumbnail']}" alt="">
//                             </a>
//                             <div class="product-box-content">
//                                 <div class="product-box-content-row">
//                                     <div class="product-box-title">
//                                         <a href="/product/${product.id}/${product['slug']}">
//                                             ${product.name}
//                                         </a>
//                                     </div>
//                                 </div>
//                                 <div class="product-box-row product-box-row-price">
//                                     <div class="price">
//                                         <div class="price-value">
//                                             <div class="price-value-wrapper">
//                                                 ${numeral(product.price).format('0,0')}
//                                                 <span class="price-currency">
//                                                     تومان
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </li>
//                 `)
//             })
//             $("#loading-backdrop").css('display', 'none')
//
//         })
//         .catch(error => {
//             console.log(error)
//         })
// }
// getProducts()


$("#search-input").keypress(event => {
    let key = event.which;
    if (key === 13) {
        let sorts = $(".listing-sort").children()
        let sortMode = ''
        for (let i = 0; i < sorts.length; i++) {
            let child = sorts.eq(i).children()
            if (child.hasClass('active')) {
                sortMode = child
            }
        }
        // console.log('hello')
        filterProducts(sortMode)
    }
})


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
            search: search,
            ordering: ordering
        }
    }
    history.replaceState({},'',`?search=${search}&order=${orderingHash}`)
    axios.get(`/api/store/category/${subCategoryID}/ware/`, data)
        .then(response => {
            let products = response.data
            if (products.length === 0) {
                $(`#${orderingHash} div ul`).append(`
                    <div class="d-flex w-100 alert alert-danger my-4 mx-3 justify-content-center">
                        محصولی یافت نشد!
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