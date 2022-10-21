let stepper;
$(document).ready(function () {
  stepper = new Stepper($('.bs-stepper')[0])
})


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
            $("#select-category").empty()
            $("#select-category").append(`<option selected disabled>دسته بندی را انتخاب کنید</option>`)
            if ($("#select-category").val() === null) {
                $("#select-sub-category").append(`
                    <option selected disabled>ابتدا دسته اصلی را انتخاب کنید</option>
                `)
                $("#select-sub-category").attr('disabled', true)
            }
            categories.map(category => {
                $("#select-category").append(`
                    <option value="${category.id}">${category.name}</option>
                `)
            })
        })
        .catch(error => {
            console.log(error.response)
        })
}
getCategories()

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
            $("#select-sub-category").empty()
            $("#select-sub-category").append(`<option selected disabled>دسته بندی را انتخاب کنید</option>`)
            if ($("#select-sub-category").val() === null) {
                $("#select-sub-sub-category").append(`
                    <option selected disabled>ابتدا دسته فرعی را انتخاب کنید</option>
                `)
                $("#select-sub-sub-category").attr('disabled', true)
            }
            subCategories.map(category => {
                $("#select-sub-category").append(`
                    <option value="${category.id}">${category.name}</option>
                `)
            })
        })
        .catch(error => {
            console.log(error.response)
        })
}
getSubCategories()

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
        })
        .catch(error => {
            console.log(error.response)
        })
}
getSubSubCategories()

const getBrands = () => {
    $("#brands").empty()
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    axios.get('/api/manager/brand/', config)
        .then(response => {
            //console.log(response)
            let brands = response.data.results
            $("#brands").append(`
                <option selected disabled>انتخاب برند</option>
            `)
            brands.map(brand => {
                $("#brands").append(`
                    <option value="${brand.id}">${brand.fa_name}</option>
                `)
            })
        })
        .catch(error => {
            console.log(error.response)
        })
}
getBrands()

const getColors = (index) => {
    $(`#select-color-${index}`).empty()
    $(`#select-color-box-${index}`).empty()
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    axios.get('/api/manager/color', config)
        .then(response => {
            // console.log(response)
            let colors = response.data.results
            $(`#select-color-${index}`).append(`
                <option selected disabled>انتخاب رنگ</option>
            `)
            colors.map((color, idx) => {
                let colorCode = `#${color.hex_code}`
                $(`#select-color-box-${index}`).append(`
                    <div class="p-1 mb-2" style="margin: 0 3.4px">
                        <div id="color-${index}-${idx}" colorID = "${color.id}" class="d-flex justify-content-center align-items-center" data-toggle="tooltip" data-placement="top" title="${color.name}"
                            style="width: 28px; height: 28px; border-radius: 50%; background-color: ${colorCode}; cursor: pointer; border: 2px solid darkgrey"
                            onclick="selectProductColor($(this).attr('id'), ${index})">
                            
                        </div>
                    </div>
                `)
                $(`#color-${index}-${idx}`).tooltip()
            })
        })
        .catch(error => {
            console.log(error.response)
        })
}
getColors(0)

const getTags = () => {
    $("#ware-tag-container").empty()
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    axios.get('/api/manager/tag', config)
        .then(response => {
            if (response.status === 200) {
                const tags = response.data.results
                if (tags.length === 0) {
                    $("#ware-tag-container").append(`
                        <div class="alert alert-warning w-100 text-center rounded">موردی یافت نشد</div>
                    `)
                }
                tags.forEach(tag => {
                    $("#ware-tag-container").append(`
                        <div class="form-check my-2">
                            <input type="checkbox" class="form-check-input ware-tag-input" id="tag-${tag.id}">
                            <label class="form-check-label mr-4" for="exampleCheck1">${tag['fa_name']}</label>
                        </div>
                    `)
                })
            }
        })
}
getTags()

const selectProductColor = (colorID, priceColorIndex) => {
    let numOfColors = $(`#select-color-box-${priceColorIndex}`).children().length
    for (let i = 0; i <= numOfColors; i++) {
        $(`#color-${priceColorIndex}-${i}`).empty()
        $(`#color-${priceColorIndex}-${i}`).removeClass('color-active')
    }
    $(`#${colorID}`).append(`
        <i class="fa fa-check" style="color: #5bc0de"></i>
    `)
    $(`#${colorID}`).addClass('color-active')
}

const fetchSubCategory = () => {
    $("#select-sub-category").empty()
    let categoryId = parseInt($("#select-category").val())
    if (categoryId !== null) {
        $("#select-sub-category").attr('disabled', false)
        $("#add-sub-cat").css('pointer-events', 'all')
    }
    let subCategoryIndex = 0
    let shownSubCategories = []
    subCategories.map(subCategory => {
        if (subCategory['category'] === categoryId) {
            subCategoryIndex = subCategories.indexOf(subCategory)
            if (subCategoryIndex > -1) {
                shownSubCategories.push(subCategories[subCategoryIndex])
            }
        }
    })
    if (shownSubCategories.length === 0) {
        $("#select-sub-category").append(`
            <option selected disabled>زیر دسته ای در این دسته وجود ندارد</option>
        `)
    } else {
        $("#select-sub-category").append(`
            <option selected disabled>
                لطفا زیر دسته بندی را انتخاب کنید!
            </option>
        `)
        shownSubCategories.map(sub => {
            $("#select-sub-category").append(`
                <option value="${sub.id}">${sub.name}</option>
            `)
        })
    }
}

const fetchSubSubCategory = () => {
    $("#select-sub-sub-category").empty()
    let subCategoryId = parseInt($("#select-sub-category").val())
    if (subCategoryId !== null) {
        $("#select-sub-sub-category").attr('disabled', false)
        $("#add-sub-sub-cat").css('pointer-events', 'all')
    }
    let subSubCategoryIndex = 0
    let shownSubSubCategories = []
    subSubCategories.map(subSubCategory => {
        if (subSubCategory['sub_category'] === subCategoryId) {
            subSubCategoryIndex = subSubCategories.indexOf(subSubCategory)
            if (subSubCategoryIndex > -1) {
                shownSubSubCategories.push(subSubCategories[subSubCategoryIndex])
            }
        }
    })
    if (shownSubSubCategories.length === 0) {
        $("#select-sub-sub-category").append(`
            <option selected disabled>زیر دسته ای در این دسته وجود ندارد</option>
        `)
    } else {
        $("#select-sub-sub-category").append(`
            <option selected disabled>
                لطفا زیر دسته بندی را انتخاب کنید!
            </option>
        `)
        shownSubSubCategories.map(sub => {
            $("#select-sub-sub-category").append(`
                <option value="${sub.id}">${sub.name}</option>
            `)
        })
    }
}

$("#select-category").change(async () => {
    await fetchSubCategory()
    const catName = $("#select-category option:selected").text()
    $("#category-selected-modal-title").text(catName)
})

$("#select-sub-category").change(async () => {
    await fetchSubSubCategory()
    const catName = $("#select-sub-category option:selected").text()
    $("#sub-category-selected-modal-title").text(catName)
})


const addProductFeature = (parent) => {
    let featureCatID = parent.parent().attr('id')
    let featureCatIndex = featureCatID[featureCatID.length - 1]

    let numberOfFeatures = $(`#product-feature-box-${featureCatIndex}`).children().length
    $(parent.children()[0]).append(`
        <div class="row w-100 my-2 mx-0" id="product-feature-${featureCatIndex}-${numberOfFeatures}">
            <div class="col-12 mt-2 mt-md-0 col-md-6">
                <label for="feature-key-${numberOfFeatures}">نام ویژگی</label>
                <input type="text" class="input-field-small text-right" placeholder="نام ویژگی" id="feature-key-${featureCatIndex}-${numberOfFeatures}">
            </div>
            <div class="col-12 mt-2 mt-md-0 col-md-6">
                <label for="feature-value-${numberOfFeatures}">مقدار ویژگی</label>
                <input type="text" class="input-field-small text-right" placeholder="مقدار ویژگی" id="feature-value-${featureCatIndex}-${numberOfFeatures}">
            </div>
        </div>
    `)
}

const addProductFeatureCategory = () => {
    let numberOfCats = $("#feature-category-box").children().length
    $("#feature-category-box").append(`
        <div class="row mx-0 w-100 border rounded py-3 my-2" id="feature-category-${numberOfCats}" style="position: relative">
            <i class="fa fa-times align-middle" onclick="$(this).parent().remove()"
                style="position: absolute; top: 8px; left: 10px; font-size: 20px; cursor: pointer; color: grey"></i>
            <div class="col-12 col-md-6">
                <label for="feature-category-title-${numberOfCats}">
                نام دسته‌ی ویژگی
                </label>
                <input type="text" class="input-field-small text-right" id="feature-category-title-${numberOfCats}" placeholder="دسته‌ی ویژگی">
            </div>
            <div class="col-12">
                <div class="row" id="product-feature-box-${numberOfCats}">
                    
                </div>
                <div class="d-flex row mx-0 mt-2">
                    <button class="btn btn-sm btn-info mr-auto" id="add-feature-btn" onclick="addProductFeature($(this).parent().parent())">
                        اضافه کردن ویژگی
                    </button>
                </div>
            </div>
        </div>
    `)
}



const getProductFeatures = () => {
    let numberOfFeatureCats = $("#feature-category-box").children().length
    let productFeatureJSON = []
    for (let i = 0; i < numberOfFeatureCats; i++) {
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
    return productFeatureJSON
}

let editorData = ''

DecoupledEditor

    .create( document.querySelector( '#editor' ) )
    .then( editor => {
        const toolbarContainer = document.querySelector( '#toolbar-container' );

        toolbarContainer.appendChild( editor.ui.view.toolbar.element );
        editorData = editor;
    } )
    .catch( error => {
        console.error( error );
    } );


const getProductReview = () => {
    const data = editorData.getData()
    // console.log(data)
    return data
}

const addProductImage = () => {
    let numOfImages = $("#images-box").children().length
    console.log(numOfImages)
    let cameraImageURL = $("#camera-icon-url").attr('url')
    $("#images-box").append(`
        <div class="avatar-upload col-12 col-sm-6 col-md-4 col-xl-3 mb-4">
            <div class="avatar-edit">
                <input type='file' id="image-upload-${numOfImages}" onchange="getProductImages(this, this.id)" accept=".png, .jpg, .jpeg" />
                <label for="image-upload-${numOfImages}">
                    <i class="fa fa-pencil"></i>
                </label>
            </div>
            <div class="avatar-preview" style="position:relative;">
                <i class="fa fa-times align-middle" onclick="$(this).parent().parent().remove()" 
                    style="position: absolute; top: 3px; left: 3px; font-size: 20px; cursor: pointer; color: grey"></i>
                <div id="image-preview-${numOfImages}" style="background-image: url(${cameraImageURL});">

                </div>
            </div>
            <div class="d-flex align-items-center mt-3">
                <label for="image-order-${numOfImages}">ترتیب عکس: </label>
                <input id="image-order-${numOfImages}" type="number" class="input-field-small image-order-field">
            </div>
            <button class="btn btn-sm btn-warning w-75 d-flex mx-auto justify-content-center"
                    onclick="postPicture(${numOfImages})"
                    id="post-picture-${numOfImages}-btn"
            >
                ثبت تصویر
            </button>
            <div id="picture-${numOfImages}-added" style="display: none; border-radius: 5px" class="alert alert-success w-100 text-center justify-content-center my-1">تصویر با موفقیت ثبت شد</div>
        </div>
    `)
}

let imagesList = []
const getProductImages = (input, inputID) => {
    let imageIndex = inputID.charAt(inputID.length - 1)

    let formData = new FormData()
    formData.append('picture', $(`#image-upload-${imageIndex}`)[0].files[0])
    imagesList.push(formData)

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
const getThumbnailImages = (input) => {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = function(e) {
            $(`#thumbnail-preview`).css('background-image', 'url('+e.target.result +')');
            $(`#thumbnail-preview`).hide();
            $(`#thumbnail-preview`).fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}


const addProductColor = async () => {
    let numOfColors = $("#colors-box").children().length
    await $("#colors-box").append(`
        <div id="color-price-box-${numOfColors}" class="col-12 col-sm-6 col-md-4 col-xl-3 mb-4" style="position: relative">
            <i class="fa fa-times align-middle" onclick="$(this).parent().remove()"
                style="position: absolute; left: 28px; top: 3px; font-size: 20px; cursor: pointer; color: grey"></i>
            <div class="ml-2 colo-price-box z-depth-2">
                <input class="input-field-small mt-4" id="price-${numOfColors}" type="number" placeholder="قیمت">
                <input class="input-field-small mt-2" id="stock-${numOfColors}" type="number" placeholder="موجودی">
                <div>
                    <label for="select-color-${numOfColors}" class="mt-3">
                        انتخاب رنگ:
                    </label>
                    <div class="d-flex">
                        <div class="colors-box d-flex justify-content-start w-100 mx-0" style="flex-wrap: wrap; max-height: 90px; overflow-y: auto" id="select-color-box-${numOfColors}">
                            
                        </div>
                    </div>
                </div>
                <div class="checkbox mt-2">
                    <input id="default-${numOfColors}" type="checkbox">
                    <label for="default-${numOfColors}">
                        قیمت پایه (اصلی)
                    </label>
                </div>
            </div>
            <button class="btn btn-sm btn-warning w-75 d-flex mx-auto justify-content-center"
                    onclick="postPrice(${numOfColors})" id="post-price-${numOfColors}-btn"
            >
            ثبت قیمت
            </button>
            <div id="price-${numOfColors}-added" style="display: none; border-radius: 5px" class="alert alert-success w-100 text-center justify-content-center my-1">قیمت با موفقیت ثبت شد</div>
        </div>
    `)
    getColors(numOfColors)
}

const getProductColors = () => {
    let price_color = []
    let numOfColors = $("#colors-box").children().length

    for (let i = 0; i < numOfColors; i++) {
        let price = $(`#price-${i}`).val()
        let stock = $(`#stock-${i}`).val()
        let color = ''
        let defaultPrice = $(`#default-${i}`).prop('checked')
        let oneProductColors = $(`#select-color-box-${i}`).children().length
        for (let j = 0; j <= oneProductColors; j++) {
            if ($(`#color-${i}-${j}`).hasClass('color-active')) {
                color = $(`#color-${i}-${j}`).attr('colorID')
            }
        }
        price_color.push({
            price: price,
            color: color,
            stock: stock,
            default: defaultPrice
        })
    }
    console.log(JSON.stringify(price_color))
    return price_color
}


let productID = 0
const postWare = () => {

    //-- clear red border for errors --//
    $("#product-name").css('border-color', 'lightgrey')
    $("#select-sub-category").css('border-color', 'lightgrey')
    $("#select-sub-sub-category").css('border-color', 'lightgrey')
    $("#brands").css('border-color', 'lightgrey')
    $("#color-select-error").css('display', 'none')
    $("#ware-error-response").css('display', 'none')
    $("#ware-error-response").empty()

    //-- auth token --//
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }

    //-- collect selected tags --//
    const tags = [];
    $(".ware-tag-input").each((idx, value) => {
        if (value.checked) {
            tags.push(value.id.split('-')[1])
        }
    })
    //console.log(tags);
    //return

    // let subCategory = $("#select-sub-category").val()
    let subSubCategory = $("#select-sub-sub-category").val()
    let brand = $("#brands").val()
    let name = $("#product-name").val()
    let productID = $("#product-id").val()
    let stock = $("#product-stock").val()
    let thumbnail = $("#thumbnail-upload")[0].files[0]
    let info = getProductReview()
    let features = getProductFeatures()

    let nameFilled = false
    name === '' ? $("#product-name").css('border-color', 'red') : nameFilled = true

    let stockFilled = false
    stock === '' ? $("#product-price").css('border-color', 'red') : stockFilled = true

    // let subCategoryFilled = false
    // subCategory === null ? $("#select-sub-category").css('border-color', 'red') : subCategoryFilled = true

    let subSubCategoryFilled = false
    subSubCategory === null ? $("#select-sub-sub-category").css('border-color', 'red') : subSubCategoryFilled = true

    let brandFilled = false
    brand === null ? $("#brands").css('border-color', 'red') : brandFilled = true

    let featuresFilled = false
    features.length === 0 ? alert('feature') : featuresFilled = true

    let data = new FormData()
    data.append('brand', brand)
    data.append('name', name)
    data.append('id', productID)
    data.append('sub_sub_category', subSubCategory)
    data.append('info', JSON.stringify(features))
    data.append('criticism', info)
    if(thumbnail !== undefined){
        data.append('thumbnail', thumbnail)
    }
    else{
        data.append('thumbnail', '')
    }
    data.append('tags', tags)

    console.log(nameFilled , subSubCategoryFilled , brandFilled , featuresFilled , stockFilled)

    if (nameFilled && subSubCategoryFilled && brandFilled && featuresFilled && stockFilled) {
        axios.post('/api/manager/ware/', data, config)
            .then(response => {
                console.log(response)
                // return
                if (response.status === 201) {
                    productID = response.data.id
                    $("#color-upload-part-label").css('display', 'block')
                    $("#image-upload-part-label").css('display', 'block')
                    $("#color-upload-part").css('display', 'unset')
                    $("#image-upload-part").css('display', 'unset')
                    let colorHeightFromTop = $('#color-upload-part-label').offset().top
                    $("html, body").animate({ scrollTop: (colorHeightFromTop - 30) }, 500);
                    console.log(colorHeightFromTop)
                    $("#post-ware-btn").attr('disabled', true)
                }
            })
            .catch(error => {
                console.log(error.response)
                let errors = error.response.data
                $("#ware-error-response").css('display', 'block')
                for (const [key, value] of Object.entries(errors)) {
                    console.log(`${value}`);
                    $("#ware-error-response").append(`
                        <strong class="d-block mb-2">${value}</strong>
                    `)
                }
            })
    } else {
        $("#post-error").removeClass('d-none')
        $("html, body").animate({ scrollTop: 0 }, 500);
    }

}

$("#post-ware-btn").click(() => {
    postWare()
})


const postPrice = (index) => {
    $(`#price-${index}`).css('border-color', 'lightgrey')
    $(`#stock-${index}`).css('border-color', 'lightgrey')
    $(`#select-color-box-${index}`).css('border-bottom', '0px')
    let productColors = $(`#select-color-box-${index}`).children().length
    let colorId = ''
    for (let j = 0; j <= productColors; j++) {
        if ($(`#color-${index}-${j}`).hasClass('color-active')) {
            colorId = $(`#color-${index}-${j}`).attr('colorID')
        }
    }
    if ($(`#price-${index}`).val() === '') {
        $(`#price-${index}`).css('border-color', 'red')
    }
    if ($(`#stock-${index}`).val() === '') {
        $(`#stock-${index}`).css('border-color', 'red')
    }
    if (colorId === '') {
        $(`#select-color-box-${index}`).css('border-bottom', '1px solid red')
    }
    if ($(`#price-${index}`).val() !== '' && $(`#stock-${index}`).val() !== '' && colorId !== '') {
        let config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
        }
        const data = {
            ware: productID,
            price: $(`#price-${index}`).val(),
            color: colorId,
            stock: $(`#stock-${index}`).val(),
            default: $(`#default-${index}`).prop('checked')
        }
        console.log(data)
        axios.post('/api/manager/product/', data, config)
            .then(response => {
                console.log(response)
                if (response.status === 201) {
                    $(`#price-${index}-added`).css('display', 'flex')
                    $(`#post-price-${index}-btn`).attr('disabled', true)
                }
            })
    }
}

const postPicture = (index) => {
    $(`#image-order-${index}`).css('border-color', 'lightgrey')
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    let formData = new FormData()
    formData.append('picture', $(`#image-upload-${index}`)[0].files[0])
    formData.append('ordering', $(`#image-order-${index}`).val())
    formData.append('ware', productID)
    if ($(`#image-order-${index}`).val() === '') {
        $(`#image-order-${index}`).css('border-color', 'red')
    }
    if ($(`#image-upload-${index}`)[0].files[0] === undefined) {
        $(`#image-upload-${index}`).css('border-bottom', '1px solid red')
    }
    if ($(`#image-order-${index}`).val() !== '' && $(`#image-upload-${index}`)[0].files[0]) {
        axios.post('/api/manager/ware-picture/', formData, config)
            .then(response => {
                if (response.status === 201) {
                    $(`#post-picture-${index}-btn`).attr('disabled', true)
                    $(`#picture-${index}-added`).css('display', 'flex')
                }
            })
    }
}

const postImage = () => {
    $("#snackbar").empty()
    let imageRequests = []
    imagesList.map((image, index) => {
        console.log(image)
        image.append('ordering', $(`#image-order-${index}`).val())
        image.append('ware', productID)

        imageRequests.push(axios.post('/api/manager/ware-picture/', image, config))
    })
    Promise.all(imageRequests)
        .then(values => {
            Promise.all(imageRequests)
                .then(values => {
                    console.log(values)
                    $("#product-uploaded-message").css('display', 'unset')
                    setTimeout(() => {
                        location.reload()
                    }, 1500)
                })
                .catch(errors => {
                    $("#snackbar").append(`
                        <strong> لطفا عکس و ترتیب را انتخاب کنید </strong>
                    `)
                    $("#snackbar").css('bottom', '0px')
                    setTimeout(() => {
                        $("#snackbar").css('bottom', '-60px')
                    }, 2500)
                })
        })
        .catch(errors => {
            $("#snackbar").append(`
                <strong> لطفا عکس و ترتیب را انتخاب کنید </strong>
            `)
            $("#snackbar").css('bottom', '0px')
            setTimeout(() => {
                $("#snackbar").css('bottom', '-60px')
            }, 2500)
            console.log(errors.response)
        })
}

$("#post-product-image").click(() => {
    postImage()
})

// $("#add-product-btn").click(() => {
//     // console.log($("#editor")[0].innerHTML)
//     postProduct()
//
// })


const addCategory = () => {
    $("#snackbar").empty()
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    let categoryName = $("#category-title").val()
    let categoryEnName = $("#category-en-title").val()
    let categoryDescription = $("#category-description").val()
    let categoryImgAlt = $("#category-img-alt").val()
    let formData = new FormData();
    let imageFile = $("#category-image")[0].files[0]

    formData.append('name', categoryName)
    formData.append('slug', categoryEnName.replace(' ', '-'))
    formData.append('image_alt', categoryImgAlt)
    formData.append('image', imageFile)
    formData.append('description', categoryDescription)

    if (categoryName !== '') {
        if (imageFile) {
            axios.post('/api/manager/category/', formData, config)
            .then(async () => {
                // console.log(response)
                await getCategories()
                $("#add-category-modal").modal('hide')
            })
            .catch(error => {
                console.log(error.response)
            })
        } else {
            $("#snackbar").append(`
                <strong>لطفا تصویر را انتخاب کنید</strong>
            `)
            $("#snackbar").css('bottom', '0px')
            setTimeout(() => {
                $("#snackbar").css('bottom', '-60px')
            }, 2500)
        }
    } else {
        $("#snackbar").append(`
            <strong>لطفا نام را انتخاب کنید</strong>
        `)
        $("#snackbar").css('bottom', '0px')
        setTimeout(() => {
            $("#snackbar").css('bottom', '-60px')
        }, 2500)
    }



}

const addSubCat = () => {
    $("#snackbar").empty()
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    let categoryId = $("#select-category").val()
    let subCategoryName = $("#sub-category-title").val()
    let subCategoryEnName = $("#sub-category-en-title").val()
    let subCategoryDescription = $("#sub-category-description").val()
    let formData = new FormData();
    let imageFile = $("#sub-category-image")[0].files[0]

    formData.append('name', subCategoryName)
    formData.append('slug', subCategoryEnName.replace(' ', '-'))
    formData.append('image', imageFile)
    formData.append('description', subCategoryDescription)
    formData.append('category', categoryId)


    if (subCategoryName !== '') {
        if (imageFile) {
            axios.post('/api/manager/sub-category/', formData, config)
            .then(async (response) => {
                let config = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    },
                }
                axios.get('/api/manager/sub-category/', config)
                    .then((response) => {
                        // console.log(JSON.stringify(response.data))
                        console.log(response.data.results)
                        subCategories = response.data.results
                        fetchSubCategory()
                    })
                    .catch(error => {
                        console.log(error.response)
                    })
                $("#add-sub-category-modal").modal('hide')
            })
            .catch(error => {
                console.log(error.response)
            })
        } else {
            $("#snackbar").append(`
                <strong>لطفا تصویر را انتخاب کنید</strong>
            `)
            $("#snackbar").css('bottom', '0px')
            setTimeout(() => {
                $("#snackbar").css('bottom', '-60px')
            }, 2500)
        }
    } else {
        $("#snackbar").append(`
            <strong>لطفا نام را انتخاب کنید</strong>
        `)
        $("#snackbar").css('bottom', '0px')
        setTimeout(() => {
            $("#snackbar").css('bottom', '-60px')
        }, 2500)
    }
}

const addSubSubCat = () => {
    $("#snackbar").empty()
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    let subCategoryId = $("#select-sub-category").val()
    let subSubCategoryName = $("#sub-sub-category-title").val()
    let subSubCategoryEnName = $("#sub-sub-category-en-title").val()
    let subSubCategoryDescription = $("#sub-sub-category-description").val()
    let formData = new FormData();
    let imageFile = $("#sub-sub-category-image")[0].files[0]

    formData.append('name', subSubCategoryName)
    formData.append('slug', subSubCategoryEnName.replace(' ', '-'))
    formData.append('image', imageFile)
    formData.append('description', subSubCategoryDescription)
    formData.append('sub_category', subCategoryId)


    if (subSubCategoryName !== '') {
        if (imageFile) {
            axios.post('/api/manager/sub-sub-category/', formData, config)
            .then(async (response) => {
                let config = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    },
                }
                axios.get('/api/manager/sub-sub-category/', config)
                    .then((response) => {
                        // console.log(JSON.stringify(response.data))
                        subSubCategories = response.data.results
                        fetchSubSubCategory()
                    })
                    .catch(error => {
                        console.log(error.response)
                    })
                $("#add-sub-sub-category-modal").modal('hide')
            })
            .catch(error => {
                console.log(error.response)
            })
        } else {
            $("#snackbar").append(`
                <strong>لطفا تصویر را انتخاب کنید</strong>
            `)
            $("#snackbar").css('bottom', '0px')
            setTimeout(() => {
                $("#snackbar").css('bottom', '-60px')
            }, 2500)
        }
    } else {
        $("#snackbar").append(`
            <strong>لطفا نام را انتخاب کنید</strong>
        `)
        $("#snackbar").css('bottom', '0px')
        setTimeout(() => {
            $("#snackbar").css('bottom', '-60px')
        }, 2500)
    }
}

const addProductBrand = () => {
    $("#snackbar").empty()
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    let brandName = $("#brand-title").val()
    let brandDescription = $("#brand-description").val()
    let formData = new FormData();
    let imageFile = $("#brand-image")[0].files[0]

    formData.append('name', brandName)
    formData.append('logo', imageFile)
    formData.append('description', brandDescription)

    if (brandName !== '') {
        if (imageFile) {
            axios.post('/api/manager/brand/', formData, config)
            .then(() => {
                // console.log(response)
                getBrands()
                $("#add-brand-modal").modal('hide')
            })
            .catch(error => {
                console.log(error)
            })
        } else {
            $("#snackbar").append(`
                <strong>لطفا تصویر را انتخاب کنید</strong>
            `)
            $("#snackbar").css('bottom', '0px')
            setTimeout(() => {
                $("#snackbar").css('bottom', '-60px')
            }, 2500)
        }
    } else {
        $("#snackbar").append(`
            <strong>لطفا نام را انتخاب کنید</strong>
        `)
        $("#snackbar").css('bottom', '0px')
        setTimeout(() => {
            $("#snackbar").css('bottom', '-60px')
        }, 2500)
    }
}

const componentToHex = (c) => {
    let hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

const rgbToHex = (r, g, b) => {
    return `${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

const addColor = () => {
    let colorName = $("#color-title").val()
    let colorCode = $(".pickr-container > .pickr > button").css('color')
    let colorCodesArray = colorCode.slice(4, colorCode.length - 1).split(',')
    let red = Number(colorCodesArray[0])
    let green = Number(colorCodesArray[1])
    let blue = Number(colorCodesArray[2])

    let colorNameFilled = true
    if (colorName === '') {
        colorNameFilled = false
    }
    if (!colorNameFilled) {
        $("#color-title").css('border-color', 'red')
    } else {
        let data = {
            name: colorName,
            hex_code: rgbToHex(red, green, blue)
        }
        let config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
        }
        axios.post('/api/manager/color/', data, config)
            .then(response => {
                console.log(response)
                getColors(0)
            })
            .catch(error => {
                console.log(error.response)
            })
    }
}

const addTag = () => {
    $("#snackbar").empty();
    $("#add-tag-en-name-ware").css('border-color', 'lightgrey')
    $("#add-tag-en-name-ware").css('border-color', 'lightgrey')
    const faName = $("#add-tag-fa-name-ware").val()
    const enName = $("#add-tag-en-name-ware").val()
    if (faName === '') {
        $("#add-tag-en-name-ware").css('border-color', 'red')
    }
    if (enName === '') {
        $("#add-tag-en-name-ware").css('border-color', 'red')
    }
    if (faName !== '' && enName !== '') {
        const data = {
            fa_name: faName,
            en_name: enName,
            slug: enName.replace(' ', '-')
        }
        let config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
        }
        axios.post('/api/manager/tag/', data, config)
            .then(async response => {
                if (response.status === 201) {
                    await getTags()
                    $("#add-tag-modal-ware").modal('hide')

                }
            })
            .catch(error => {
                $("#snackbar").empty()
                $("#snackbar").append(`
                    <strong>${error.response.data['en_name'][0]}</strong>
                `)
                $("#snackbar").css('bottom', '0')
                setTimeout(() => {
                    $("#snackbar").css('bottom', '-60px')
                }, 2500)
            })
    }
}
