// Get Categories List from server
let categoryList = ''
const getCategories = () => {
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    axios.get('/api/manager/category/', config)
        .then(response => {
            // console.log(response)
            let categories = response.data.results
            categoryList = response.data.results
            categories.map(category => {
                $("#categories-list").append(`
                    <li>
                        <span class="d-flex" onclick="collapseSubCategory(${category.id})">
                            ${category.name}
                            <div class="mr-auto" style="width: fit-content">
                                <i class="fa fa-chevron-down mr-auto " style="color: grey"></i>
                            </div>
                        </span>
                        <ul class="sub-category-list" style="display: none" id="category-${category.id}">
                            
                        </ul>
                    </li>
                    <hr style="margin: 5px -24px">
                `)
            })
            getSubCategories()
        })
        .catch(error => {
            console.log(error.response)
        })
}
getCategories()

// Get Sub Categories List from server
let subCategories = ''
const getSubCategories = () => {
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    axios.get('/api/manager/sub-category/', config)
        .then((response) => {
            // console.log(JSON.stringify(response.data))
            subCategories = response.data.results
            // console.log(subCategories)
            subCategories.map(subCategory => {
                $(`#category-${subCategory['category']}`).append(`
                    <li>
                        <div class="checkbox">
                            <input id="sub-category-${subCategory.id}" type="checkbox" onclick="selectedSubCategories($(this))">
                            <label for="sub-category-${subCategory.id}">
                                ${subCategory.name}
                            </label>
                        </div>
                    </li>
                `)
            })
        })
        .catch(error => {
            console.log(error.response)
        })
}

let subSubCategories = ''
const getSubSubCategories = () => {
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    axios.get('/api/manager/sub-sub-category/', config)
        .then((response) => {
            // console.log(JSON.stringify(response.data))
            subSubCategories = response.data.results
            console.log(response.data.results)
            // console.log(subCategories)
            subCategories.map(subCategory => {
                $(`#category-${subCategory['category']}`).append(`
                    <li>
                        <div class="checkbox">
                            <input id="sub-category-${subCategory.id}" type="checkbox" onclick="selectedSubCategories($(this))">
                            <label for="sub-category-${subCategory.id}">
                                ${subCategory.name}
                            </label>
                        </div>
                    </li>
                `)
            })
        })
        .catch(error => {
            console.log(error.response)
        })
}

getSubSubCategories()

// Collapse Sub Categories in sidebar
const collapseSubCategory = (catID) => {
    // console.log(catID)
    if ($(`#category-${catID}`).css('display') === 'none') {
        $(`#category-${catID}`).slideDown(300)
    } else {
        $(`#category-${catID}`).slideUp(300)
    }

}


// Get Brands List from server
let brands = ''
const getBrands = () => {
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    axios.get('/api/manager/brand', config)
        .then(response => {
            // console.log(response)
            brands = response.data.results
            brands.map(brand => {
                $("#brands-box").append(`
                    <div class="checkbox">
                        <input id="brand-${brand.id}" type="checkbox" onclick="selectedBrands($(this))">
                        <label for="brand-${brand.id}">
                            ${brand.name}
                        </label>
                    </div>
                `)
            })
        })
        .catch(error => {
            console.log(error)
        })
}
getBrands()

// Get Colors List from server
let colors = []
const getColors = () => {
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    axios.get('/api/manager/color', config)
        .then(response => {
            // console.log(response)
            colors = response.data.results
        })
        .catch(error => {
            console.log(error.response)
        })
}
getColors()


// Selected Sub Cats by manager to filter products
let selectedSubs = []
const selectedSubCategories = (checkbox) => {
    let checkboxStatus = checkbox.prop('checked')
    let checkboxID = checkbox.attr('id')
    let subID = checkboxID.charAt(checkboxID.length - 1)
    if (checkboxStatus) {
        selectedSubs.push(subID)
    } else {
        let index = selectedSubs.indexOf(subID)
        selectedSubs.splice(index, 1)
    }
    return selectedSubs
}

// Selected Brands by manager to filter products
let selectedBrand = []
const selectedBrands = (checkbox) => {
    let checkboxStatus = checkbox.prop('checked')
    let checkboxID = checkbox.attr('id')
    let BrandID = checkboxID.charAt(checkboxID.length - 1)
    if (checkboxStatus) {
        selectedBrand.push(BrandID)
    } else {
        let index = selectedBrand.indexOf(BrandID)
        selectedBrand.splice(index, 1)
    }
    return selectedBrand
}


// Get Products List from server and filter them.
const getProductsList = () => {
    $("#loading-backdrop").css('display', 'unset')
    let selectedSubCategories = selectedSubs.join(',')
    let selectedBrands = selectedBrand.join(',')
    let searchedTitle = $("#product-search-title").val()
    $("#products-list-box").empty()
    $("#products-list-box-list-view").empty()
    let config = {
        params: {
            sub_category: selectedSubCategories,
            brand: selectedBrands,
            search: searchedTitle
        },
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    axios.get('/api/manager/ware/', config)
        .then(response => {
            // console.log(response)
            let productsList = response.data.results
            if (productsList.length === 0) {
                $("#products-list-box").append(`
                    <h6 class="w-100 d-flex justify-content-center">محصولی یافت نشد!</h6>
                `)
                $("#products-list-box-list-view").append(`
                    <h6 class="w-100 d-flex justify-content-center">محصولی یافت نشد!</h6>
                `)
            }
            productsList.map(product => {
                $("#products-list-box").append(`
                    <div class="col-12 col-xl-6 ">
                        <div class="product-tile mb-3">
                            <div class="product-image-box">
                                <img src="${product['thumbnail']}" alt="${product['name']}">
                            </div>
                            <div class="product-title-box mt-3" style="height: 70px">
                                <a href="/product/${product['id']}/${product['slug']}" target="_blank" class="d-flex justify-content-center h-100">
                                    <h4 class="profile-recent-fav-name my-auto text-center px-3">
                                        ${product.name}
                                    </h4>
                                </a>
                            </div>
                            <hr class="w-100 mb-0">
                            <div class="product-actions d-flex justify-content-center align-items-center px-4" style="height: 50px">
                                <button class="btn-action btn-action-remove ml-1" onclick="getSingleProductDetails(${product.id})">
                                    <i class="fa fa-edit"></i>
                                </button>
                                <button class="btn-action btn-action-remove mr-1" onclick="deleteProduct(${product.id})">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `)
                $("#products-list-box-list-view").append(`
                    <div class="col-12 profile-recent-fav-row border d-flex rounded mb-2 py-3" style="background-color: white; min-height: 100px; max-height: 100px">
                        <a href="#" class="profile-recent-fav-col h-100 profile-recent-fav-col-thumb">
                            <img src="${product['thumbnail']}" style="max-height: 90px; object-fit: cover" alt="product">
                        </a>
                        <div class="profile-recent-fav-col h-100 profile-recent-fav-col-title">
                            <a href="/product/${product['id']}/${product['slug']}" target="_blank">
                                <h4 class="profile-recent-fav-name my-auto text-center">
                                    ${product.name}
                                </h4>
                            </a>
                        </div>
                        <div class="profile-recent-fav-col h-100 profile-recent-fav-col-actions">
                            <button class="btn-action btn-action-remove ml-1" onclick="getSingleProductDetails(${product.id})">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button class="btn-action btn-action-remove mr-1" onclick="deleteProduct(${product.id})">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `)
            })
            $("#loading-backdrop").css('display', 'none')
        })
        .catch(error => {
            console.log(error.response)
        })
}
getProductsList()



let singleProductID = ''
const getSingleProductDetails = (productID) => {
    $("#images-box").empty()
    singleProductID = productID
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    axios.get(`/api/manager/ware/${productID}`, config)
        .then(response => {
            // console.log(response)
            setProductWare(response.data)
            setProductImages(response.data['picture'])
            setProductColors(response.data['product'])
            return response.data
        })
        .catch(error => {
            console.log(error)
            console.log(error.response)
        })
    $("#edit-product-modal").modal('show')
}

// Set Product Ware while editing it
const setProductWare = (wareData) => {
    // console.log(wareData)
    $("#feature-category-box").empty()
    $("#product-brand").empty()
    $("#product-category").empty()
    $("#product-sub-category").empty()
    console.log(wareData)
    let productFeatures = JSON.parse(wareData.info)
    $("#product-title").val(wareData['name'])
    brands.map(brand => {
        if (brand['id'] === wareData['brand']) {
            $("#product-brand").append(`
                <option selected value="${brand['id']}">${brand['name']}</option>
            `)
        } else {
            $("#product-brand").append(`
                <option value="${brand['id']}">${brand['name']}</option>
            `)
        }
    })
    console.log(categoryList)
    categoryList.map(category => {
        if (category['id'] === wareData['sub_category']['category']) {
            $("#product-category").append(`
                <option selected value="${category['id']}">${category['name']}</option>
            `)
        } else {
            $("#product-category").append(`
                <option value="${category['id']}">${category['name']}</option>
            `)
        }
    })
    let catID = $("#product-category").val()
    subCategories.map(sub => {
        if (parseInt(catID) === parseInt(sub['category'])) {
            if (sub['id'] === wareData['sub_category']['id']) {
                $("#product-sub-category").append(`
                    <option selected value="${sub['id']}">${sub['name']}</option>
                `)
            } else {
                $("#product-sub-category").append(`
                    <option value="${sub['id']}">${sub['name']}</option>
                `)
            }
        }
    })
    $("#product-category").change(() => {
        $("#product-sub-category").empty()
        let catID = $("#product-category").val()
        subCategories.map(sub => {
            if (parseInt(catID) === parseInt(sub['category'])) {
                if (sub['id'] === wareData['sub_category']['id']) {
                    $("#product-sub-category").append(`
                        <option selected value="${sub['id']}">${sub['name']}</option>
                    `)
                } else {
                    $("#product-sub-category").append(`
                        <option value="${sub['id']}">${sub['name']}</option>
                    `)
                }
            }
        })
    })
    productFeatures.map((feature, index) => {
        $("#feature-category-box").append(`
            <div class="row mx-0 w-100 border rounded py-3 my-2" id="feature-category-${index}" style="position: relative">
                <i class="fa fa-times mr-auto" onclick="$(this).parent().remove()" style="position: absolute; left: 15px; top: 15px; cursor: pointer; font-size: 18px"></i>
                <div class="col-12 col-md-6">
                    <label for="feature-category-title-${index}">نام دسته‌ی ویژگی</label>
                    <input type="text" class="input-field-small text-right" id="feature-category-title-${index}" placeholder="دسته‌ی ویژگی">
                </div>
                <div class="col-12">
                    <div class="row" id="product-feature-box-${index}">
                        
                    </div>
                </div>
                <div class="col-12">
                    <button class="btn btn-sm btn-info d-flex mr-auto" onclick="addFeature(${index})">اضافه کردن ویژگی</button>
                </div>
            </div>
        `)
        $(`#feature-category-title-${index}`).val(feature['category_name'])
        feature['features'].map((item, idx) => {
            $(`#product-feature-box-${index}`).append(`
                <div class="row my-2 w-100 mx-0" id="product-feature-${index}-${idx}">
                    <div class="col-11 mt-2 mt-md-0 col-md-5">
                        <label for="feature-key-${index}-${idx}">نام ویژگی</label>
                        <input type="text" class="input-field-small text-right" placeholder="نام ویژگی" id="feature-key-${index}-${idx}">
                    </div>
                    <div class="col-11 mt-2 mt-md-0 col-md-6">
                        <label for="feature-value-${index}-${idx}">مقدار ویژگی</label>
                        <input type="text" class="input-field-small text-right" placeholder="مقدار ویژگی" id="feature-value-${index}-${idx}">
                    </div>
                    <div class="col-1 d-flex justify-content-center align-items-center">
                        <i class="fa fa-times mt-4 ml-3" onclick="$(this).parent().parent().remove()" style="font-size: 18px; cursor: pointer"></i>
                    </div>
                </div>
            `)
            $(`#feature-key-${index}-${idx}`).val(Object.keys(item))
            $(`#feature-value-${index}-${idx}`).val(item[Object.keys(item)])
        })
    })
}

$("#add-new-feature-category").click(() => {
    let numOfFeatureCats = $("#feature-category-box").children().length
    $("#feature-category-box").append(`
        <div class="row mx-0 w-100 border rounded py-3 my-2" id="feature-category-${numOfFeatureCats}" style="position: relative">
            <i class="fa fa-times mr-auto" onclick="$(this).parent().remove()" style="position: absolute; left: 15px; top: 15px; cursor: pointer; font-size: 18px"></i>
            <div class="col-12 col-md-6">
                <label for="feature-category-title-${numOfFeatureCats}">نام دسته‌ی ویژگی</label>
                <input type="text" class="input-field-small text-right" id="feature-category-title-${numOfFeatureCats}" placeholder="دسته‌ی ویژگی">
            </div>
            <div class="col-12">
                <div class="row" id="product-feature-box-${numOfFeatureCats}">
                    
                </div>
            </div>
            <div class="col-12">
                <button class="btn btn-sm btn-info d-flex mr-auto" onclick="addFeature(${numOfFeatureCats})">اضافه کردن ویژگی</button>
            </div>
        </div>
    `)
})

const addFeature =(index) => {
    let numOfFeatures = $(`#product-feature-box-${index}`).children().length
    $(`#product-feature-box-${index}`).append(`
        <div class="row my-2 w-100 mx-0" id="product-feature-${index}-${numOfFeatures}" style="position: relative">
            <div class="col-11 mt-2 mt-md-0 col-md-5">
                <label for="feature-key-${index}-${numOfFeatures}">نام ویژگی</label>
                <input type="text" class="input-field-small text-right" placeholder="نام ویژگی" id="feature-key-${index}-${numOfFeatures}">
            </div>
            <div class="col-11 mt-2 mt-md-0 col-md-6">
                <label for="feature-value-${index}-${numOfFeatures}">مقدار ویژگی</label>
                <input type="text" class="input-field-small text-right" placeholder="مقدار ویژگی" id="feature-value-${index}-${numOfFeatures}">
            </div>
            <div class="col-1 d-flex justify-content-center align-items-center">
                <i class="fa fa-times mt-4 ml-3" onclick="$(this).parent().parent().remove()" style="font-size: 18px; cursor: pointer"></i>
            </div>
        </div>
    `)
}

const updateProductWare = () => {
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    let numOfFeatureCats = $("#feature-category-box").children().length
    let productFeatureJSON = []
    for (let i = 0; i < numOfFeatureCats; i++) {
        let categoryTitle = $(`#feature-category-title-${i}`).val()
        let numOfFeatures = $(`#product-feature-box-${i}`).children().length

        productFeatureJSON.push({
            category_name: categoryTitle,
            features: []
        })

        for (let j = 0; j < numOfFeatures; j++) {
            let key = $(`#feature-key-${i}-${j}`).val()
            let value = $(`#feature-value-${i}-${j}`).val()
            productFeatureJSON[i].features.push({
                [key]: value
            })
        }
    }
    let data = {
        name: $("#product-title").val(),
        brand: $("#product-brand").val(),
        category: $("#product-category").val(),
        sub_category: $("#product-sub-category").val(),
        info: JSON.stringify(productFeatureJSON)
    }
    axios.patch(`/api/manager/ware/${singleProductID}/`, data, config)
        .then(response => {
            if (response.status === 200) {
                getProductsList()
                $("#edit-product-modal").modal('hide')
            }
        })
        .catch(error => {
            console.log(error)
        })
}

$("#update-product-ware").click(() => {
    updateProductWare()
})

// Set Product Images while editing it
const setProductImages = (imageList) => {
    $("#images-box").empty()
    imageList.map((image, index) => {
        $("#images-box").append(`
            <div class="avatar-upload col-12 col-sm-6 col-md-4 col-xl-3 mb-4">
                <div class="avatar-preview d-flex mx-auto">
                    <div class="avatar-edit">
                        <input type='file' id="image-upload-${index}" onchange="getProductImages(this, this.id)" accept=".png, .jpg, .jpeg" />
                        <label for="image-upload-${index}">
                            <i class="fa fa-pencil"></i>
                        </label>
                    </div>
                    <div class="delete-image-box" id="delete-image-box-${image.id}" onclick="deleteImage(${image['id']})" >
                        <i class="fa fa-trash"></i>
                    </div>
                    <div id="image-preview-${index}" style="background-image: url(${image.picture});">
                        
                    </div>
                </div>
                <div class="d-flex mx-auto align-items-center mt-3">
                    <label for="image-order-${index}">ترتیب عکس: </label>
                    <input id="image-order-${index}" type="number" class="input-field-small image-order-field" value="${image.ordering}">
                </div>
                <div class="w-100 d-flex justify-content-center align-items-center mt-3">
                    <button class="btn w-50 btn-sm btn-info" onclick="uploadImage($(this).parent().parent())">آپلود تصویر</button>
                </div>
            </div>
        `)
    })
}

// Set Product Colors while editing it
const setProductColors = (colorsList) => {
    $("#colors-box").empty()
    colorsList.map((color, index) => {
        $("#colors-box").append(`
            <div id="color-price-box-${index}" class="col-12 col-sm-6 col-md-4 mb-4">
                <div class="ml-2 z-depth-2 colo-price-box" id="color-price-box-${index}">
                    <i id="delete-color-${index}" onclick="deleteColor(${color.id})"
                        class="fa fa-trash mr-auto" style="font-size: 18px; color: grey; cursor: pointer"></i>
                    <input class="input-field-small mt-4" id="price-${index}" value="${color.price}" type="number" placeholder="قیمت">
                    <input class="input-field-small mt-2" id="stock-${index}" value="${color.stock}" type="number" placeholder="موجودی">
                    <div>
                        <label class="mt-3" for="select-color-${index}">انتخاب رنگ:</label>
                        <div class="d-flex">
                            <div class="d-flex justify-content-start w-100 mx-0"
                                 style="flex-wrap: wrap; max-height: 90px; overflow-y: auto" id="single-colors-box-${index}">
                                    
                            </div>
                        </div>
                    </div>
                    <div class="checkbox mt-2">
                        <input id="default-${index}" type="checkbox">
                        <label for="default-${index}">
                            قیمت پایه (اصلی)
                        </label>
                    </div>
                </div>
            </div>
        `)
        if (color['default']) {
            $(`#default-${index}`).attr('checked', true)
        }
        colors.map((oneColor, idx) => {
            let colorCode = `#${oneColor.hex_code}`
            $(`#single-colors-box-${index}`).append(`
                <div class="p-1 mb-2" style="margin: 0 3.4px">
                    <div id="color-${index}-${idx}" colorID = "${oneColor.id}" class="d-flex justify-content-center align-items-center" data-toggle="tooltip" data-placement="top" title="${oneColor.name}"
                        style="width: 28px; height: 28px; border-radius: 50%; background-color: ${colorCode}; cursor: pointer; border: 2px solid darkgrey"
                        onclick="selectProductColor($(this).attr('id'), ${index})">
                    </div>
                </div>
            `)
            $(`#color-${index}-${idx}`).tooltip()
            if (color['color']['hex_code'] === oneColor.hex_code) {
                $(`#color-${index}-${idx}`).addClass('color-active')
                $(`#color-${index}-${idx}`).append(`
                    <i class="fa fa-check" style="color: #5bc0de"></i>
                `)
            }
        })
    })
}

const addNewImage = () => {
    let numOfNewImages = $("#new-images-box").children().length - 1
    let cameraImageURL = $("#camera-icon-url").attr('url')
    $("#new-images-box").append(`
        <div class="avatar-upload mx-1 col-12 col-sm-6 col-md-4 col-xl-3 mb-4">
            <div class="avatar-preview d-flex mx-auto">
                <div class="avatar-edit">
                    <input type='file' id="new-image-upload-${numOfNewImages}" onchange="getProductNewImages(this, this.id)" accept=".png, .jpg, .jpeg" />
                    <label for="new-image-upload-${numOfNewImages}">
                        <i class="fa fa-pencil"></i>
                    </label>
                </div>
                <div id="new-image-preview-${numOfNewImages}" style="background-image: url(${cameraImageURL});">
                    
                </div>
            </div>
            <div class="d-flex mx-auto align-items-center mt-3">
                <label for="new-image-order-${numOfNewImages}">ترتیب عکس: </label>
                <input id="new-image-order-${numOfNewImages}" type="number" class="input-field-small image-order-field">
            </div>
            <div class="w-100 d-flex justify-content-center align-items-center mt-3">
                <button class="btn w-50 btn-sm btn-info" onclick="uploadImage($(this).parent().parent())">آپلود تصویر</button>
            </div>
        </div>
    `)
}


const getProductNewImages = (input, inputID) => {
    let imageIndex = inputID.charAt(inputID.length - 1)

    // let formData = new FormData()
    // formData.append('picture', $(`#image-upload-${imageIndex}`)[0].files[0])
    // imagesList.push(formData)

    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = function(e) {
            $(`#new-image-preview-${imageIndex}`).css('background-image', 'url('+e.target.result +')');
            $(`#new-image-preview-${imageIndex}`).hide();
            $(`#new-image-preview-${imageIndex}`).fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

const uploadImage = (mainBox) => {
    let imageInput = mainBox.children().eq(0).children().eq(0).children().eq(0)
    let ordering = mainBox.children().eq(1).children().eq(1).val()
    console.log(ordering)
    let imageFile = imageInput[0].files[0]
    let formData = new FormData()
    formData.append('picture', imageFile)
    formData.append('ordering', ordering)
    formData.append('ware', singleProductID)
    if (ordering === '') {
        alert('error')
    } else {
        axios.post('/api/manager/ware-picture/', formData, config)
            .then(response => {
                console.log(response)
                if (response.status === 201) {
                    getSingleProductDetails(singleProductID)
                }
            })
            .catch(error => {
                console.log(error)
                console.log(error.response)
                if (error.response.status === 400) {
                    $("#image-upload-failed").css('display', 'unset')
                }
            })
    }

}

const deleteImage = (imageID) => {
    console.log(imageID)
    axios.delete(`/api/manager/ware-picture/${imageID}`, config)
        .then(response => {
            console.log(response)
            if (response.status === 204) {
                getSingleProductDetails(singleProductID)
            }
        })
        .catch(error => {
            console.log(error)
            console.log(error.response)
        })
}

const deleteColor = (colorID) => {
    console.log(colorID)
    axios.delete(`/api/manager/product/${colorID}`, config)
        .then(response => {
            console.log(response)
            if (response.status === 204) {
                getSingleProductDetails(singleProductID)
            }
        })
        .catch(error => {
            console.log(error)
            console.log(error.response)
        })
    // axios.delete(`/api/manager/color/${colorID}`, config)
    //     .then(response => {
    //         console.log(response)
    //         if (response.status === 204) {
    //             getSingleProductDetails(singleProductID)
    //         }
    //     })
    //     .catch(error => {
    //         console.log(error.response)
    //     })
}

const addNewPriceColor = () => {
    let numOfNewPriceColors = $("#new-price-color-box").children().length
    $("#new-price-color-box").append(`
        <div id="new-color-price-box-${numOfNewPriceColors}" class="col-12 col-sm-6 col-md-4 mb-4">
            <div class="ml-2 z-depth-2 colo-price-box" id="new-color-price-box-${numOfNewPriceColors}">
                <i id="new-delete-color-${numOfNewPriceColors}" onclick="$(this).parent().parent().remove()" data-toggle="tooltip" data-placement="top" title="حذف قیمت"
                    class="fa fa-trash mr-auto" style="font-size: 18px; color: grey; cursor: pointer"></i>
                <input class="input-field-small mt-4" id="new-price-${numOfNewPriceColors}" type="number" placeholder="قیمت">
                <input class="input-field-small mt-2" id="new-stock-${numOfNewPriceColors}" type="number" placeholder="موجودی">
                <div>
                    <label class="mt-3" for="select-color-${numOfNewPriceColors}">انتخاب رنگ:</label>
                    <div class="d-flex">
                        <div class="d-flex justify-content-start w-100 mx-0"
                             style="flex-wrap: wrap; max-height: 90px; overflow-y: auto" id="new-single-colors-box-${numOfNewPriceColors}">
                            
                        </div>
                    </div>
                </div>
                <div class="checkbox mt-2">
                    <input id="new-default-${numOfNewPriceColors}" type="checkbox">
                    <label for="new-default-${numOfNewPriceColors}">
                        قیمت پایه (اصلی)
                    </label>
                </div>
                <div>
                    <button class="btn btn-sm w-100 btn-info mt-2" onclick="uploadNewColorPrice($(this).parent().parent())">آپلود رنگ و قیمت</button>
                </div>
            </div>
        </div>
    `)
    colors.map((oneColor, idx) => {
        let colorCode = `#${oneColor.hex_code}`
        $(`#new-single-colors-box-${numOfNewPriceColors}`).append(`
            
            <div class="p-1 mb-2" style="margin: 0 3.4px">
                <div id="new-color-${numOfNewPriceColors}-${idx}" colorID = "${oneColor.id}" class="d-flex justify-content-center align-items-center" data-toggle="tooltip" data-placement="top" title="${oneColor.name}"
                    style="width: 28px; height: 28px; border-radius: 50%; background-color: ${colorCode}; cursor: pointer; border: 2px solid darkgrey"
                    onclick="selectNewProductColor($(this).attr('id'), ${numOfNewPriceColors})">
                </div>
            </div>
        `)
        $(`#new-color-${numOfNewPriceColors}-${idx}`).tooltip()
    })
}

const selectProductColor = (colorID, priceColorIndex) => {
    let numOfColors = $(`#single-colors-box-${priceColorIndex}`).children().length
    console.log(numOfColors)
    for (let i = 0; i <= numOfColors; i++) {
        $(`#color-${priceColorIndex}-${i}`).empty()
        $(`#color-${priceColorIndex}-${i}`).removeClass('color-active')
    }
    $(`#${colorID}`).append(`
        <i class="fa fa-check" style="color: #5bc0de"></i>
    `)
    $(`#${colorID}`).addClass('color-active')
}

const selectNewProductColor = (colorID, priceColorIndex) => {
    let numOfColors = $(`#new-single-colors-box-${priceColorIndex}`).children().length
    console.log(numOfColors)
    for (let i = 0; i <= numOfColors; i++) {
        $(`#new-color-${priceColorIndex}-${i}`).empty()
        $(`#new-color-${priceColorIndex}-${i}`).removeClass('color-active')
    }
    $(`#${colorID}`).append(`
        <i class="fa fa-check" style="color: #5bc0de"></i>
    `)
    $(`#${colorID}`).addClass('color-active')
}
const uploadNewColorPrice = (mainBox) => {
    let mainBoxID = mainBox.attr('id')
    let price = mainBox.children().eq(1).val()
    let stock = mainBox.children().eq(2).val()
    let color = ''
    let oneProductColors = $(`#new-single-colors-box-${mainBoxID.split("-")[4]}`).children().length
    for (let j = 0; j <= oneProductColors; j++) {
        if ($(`#new-color-${mainBoxID.split("-")[4]}-${j}`).hasClass('color-active')) {
            console.log('yes')
            color = $(`#new-color-${mainBoxID.split("-")[4]}-${j}`).attr('colorID')
        }
    }
    let data = {
        ware: singleProductID,
        color: color,
        price: price,
        stock: stock
    }
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    axios.post('/api/manager/product/', data, config)
        .then(response => {
            console.log(response)
            if (response.status === 201) {
                $("#edit-product-modal").modal('hide')
            }
        })
        .catch(error => {
            console.log(error)
        })
}



const getProductImages = (input, inputID) => {
    let imageIndex = inputID.charAt(inputID.length - 1)

    // let formData = new FormData()
    // formData.append('picture', $(`#image-upload-${imageIndex}`)[0].files[0])
    // imagesList.push(formData)

    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = function(e) {
            $(`#image-preview-${imageIndex}`).css('background-image', 'url('+e.target.result +')');
            $(`#image-preview-${imageIndex}`).hide();
            $(`#image-preview-${imageIndex}`).fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// const editingPartType = (typeMode) => {
//     console.log(typeMode)
// }

const deleteProduct = (productID) => {
    console.log(productID)
    $("#delete-product-modal").modal('show')
    $("#submit-delete-product").click(() => {
        axios.delete(`/api/manager/ware/${productID}`, config)
            .then(response => {
                console.log(response)
                getProductsList()
                $("#delete-product-modal").modal('hide')
            })
            .catch(error => {
                console.log(error)
            })
    })
}

function editTypeChange(typeMode) {
    let tempArr = typeMode.split('-')
    tempArr.splice(-1, 1)
    tempArr.push('content')
    let typeContentID = tempArr.join('-')
    $("#edit-type-list").children().eq(0).removeClass('tab-active')
    $("#edit-type-list").children().eq(1).removeClass('tab-active')
    $("#edit-type-list").children().eq(2).removeClass('tab-active')
    $(`#${typeMode}`).addClass('tab-active')

    $("#edit-type-content").children().eq(0).css('display', 'none')
    $("#edit-type-content").children().eq(1).css('display', 'none')
    $("#edit-type-content").children().eq(2).css('display', 'none')

    $(`#${typeContentID}`).fadeIn('300')

}

// $(".type-mode-tab").click(() => {
//     editingPartType($(this))
// })

$("#list-view").click(() => {
    $("#products-list-box").fadeOut(0)
    $("#table-view").removeClass('view-active')
    $("#products-list-box-list-view").fadeIn(350)
    $("#list-view").addClass('view-active')
})
$("#table-view").click(() => {
    $("#products-list-box-list-view").fadeOut(0)
    $("#list-view").removeClass('view-active')
    $("#products-list-box").fadeIn(350)
    $("#table-view").addClass('view-active')

})