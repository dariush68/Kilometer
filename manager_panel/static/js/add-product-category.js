

//---------------------------------------------------//
//-----    category functions    --------------------//
//---------------------------------------------------//
let categoryList = ''

//-- all category --//
let categories;

//-- write to upload image lable --//
$('#category-image').on('change',function(){
    //get the file name
    var fileName = $(this).val();
    //replace the "Choose a file" label
    $(this).next('.custom-file-label').html(fileName);
})

const getCategories = () => {
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    axios.get('/api/manager/category/', config)
        .then(response => {
            $("#category-tbody").empty()
            $("#select-category").empty()
            $("#select-category").append(`<option selected disabled>دسته بندی را انتخاب کنید</option>`)
            categories = response.data.results
            categoryList = response.data.results
            categories.map((category, index) => {
                $("#category-tbody").append(`
                    <tr id="category-${category.id}" class="tr-category" onclick="fillCategoryForm(${index}, 'category-${category.id}')">
                        <td style="width: 15%">${index + 1}</td>
                        <td style="width: 65%">${category.name}</td>
                        <td style="width: 20%">
                            <div class="d-flex justify-content-around align-items-center">
                                <i class="fa fa-trash align-middle" onclick="deleteCategory(${category.id}, '${category.name}')"></i>
                            </div>
                        </td>
                    </tr>
                `)
                $("#select-category").append(`
                    <option catname="${category.name}" id="category-${category.id}" value="${category.id}">${category.name}</option>
                `)
            })
        })
        .catch(error => {
            console.log(error.response)
        })
}
window.onload = getCategories

const addCategory = () => {

    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    let categoryName = $("#category-title").val()
    let categoryEnName = $("#category-en-title").val()
    let categoryDescription = $("#category-description").val()
    let categoryImageAlt = $("#category-img-alt").val();
    let formData = new FormData();
    let imageFile = $("#category-image")[0].files[0]

    formData.append('name', categoryName)
    formData.append('slug', categoryEnName.replace(' ', '-'))
    if(imageFile != undefined){
        formData.append('image', imageFile);
    }
    formData.append('image_alt', categoryImageAlt)          //-- use category name for alt image --//
    formData.append('description', categoryDescription)

    axios.post('/api/manager/category/', formData, config)
        .then(async () => {
            // console.log(response)
            //-- get all category list --//
            await getCategories()

            //-- clear inputs field --//
            clearCategoryForm();
            //-- show message --//
            showSnackbar( 'دسته بندی ' + categoryName + ' با موفقیت افزوده شد' , '#43a047')
        })
        .catch(error => {
            console.log(error.response)
            let err = error.response.data
            let errorTxt = Object.keys(err)
            //console.log(errorTxt)
            errorTxt.map(txt => {

                $(`input[name=${txt}]`).addClass(' is-invalid')

            })
        })

}

const editCategory = () => {

    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    let categoryID = $("#category-id").val();
    if(categoryID == '') return
    let categoryName = $("#category-title").val();
    let categoryEnName = $("#category-en-title").val();
    let categoryImageAlt = $("#category-img-alt").val();
    let categoryDescription = $("#category-description").val();
    let formData = new FormData();
    let imageFile = $("#category-image")[0].files[0]

    formData.append('name', categoryName)
    formData.append('slug', categoryEnName.replace(' ', '-'))
    console.log(($("#pic-remove").prop('checked') == true), ' chkbox')
    if(imageFile != undefined){
        formData.append('image', imageFile);
    }
    else if($("#pic-remove").prop('checked') == true){
        console.log("no image")
        formData.append('image', '')
    }
    formData.append('image_alt', categoryImageAlt)
    formData.append('description', categoryDescription)

    axios.put('/api/manager/category/'+categoryID+'/', formData, config)
        .then(async () => {
            // console.log(response)
            //-- get all category list --//
            await getCategories()
            //-- clear inputs field --//
            clearCategoryForm();
            //-- show message --//
            showSnackbar( 'دسته بندی ' + categoryName + ' با موفقیت تغییر داده شد' , '#43a047')
        })
        .catch(error => {
            console.log(error.response)
            let err = error.response.data
            let errorTxt = Object.keys(err)
            console.log(errorTxt)

            errorTxt.map(txt => {
                $(`input[name=${txt}]`).addClass(' is-invalid')
            })
        })
}

const clearCategoryForm = () => {


    //-- clear inputs field and reset to default --//
    $("#errors-box").empty();

    //-- clear inputs field --//
    $('#form-add-category-apc1').find('input:text, input:password, input:file, input:hidden, select, textarea').val('');
    $('#form-add-category-apc1').find('input:text, input:password, input:file, input:hidden, select, textarea')
        .removeClass(" is-invalid")

    $('#form-add-category-apc1').find('input:radio, input:checkbox')
         .removeAttr('checked').removeAttr('selected');
    $('#form-add-category-apc1').find('input:checkbox').prop( "checked", false );
    $('#form-add-category-apc1').find('label').html( "انتخاب فایل" );

    $('#form-add-category-apc1').find('img').attr('src', "/static/assets/images/camera.svg");

    /*$('#form-add-category-apc1').find('input:text, input:password, input:file, input:hidden, select, textarea').each(function (){
        console.log(this)
    })*/
}

const fillCategoryForm = (arrayIndex, trID) => {
    //console.log(JSON.stringify(categories[arrayIndex]))

    clearCategoryForm();

    $(".tr-category").removeClass('table-primary');
    let selectedObj = "#" + trID;
    $(selectedObj).addClass('table-primary')

    $("#category-id").val(categories[arrayIndex].id);

    if(categories[arrayIndex].image) $("#img-category-selected").attr('src', categories[arrayIndex].image);

    if(categories[arrayIndex].name != null) $("#category-title").val(categories[arrayIndex].name);

    if(categories[arrayIndex].slug != null) $("#category-en-title").val(categories[arrayIndex].slug.replace('-', ' '));

    if(categories[arrayIndex].image_alt != null) $("#category-img-alt").val(categories[arrayIndex].image_alt);

    if(categories[arrayIndex].description != null) $("#category-description").val(categories[arrayIndex].description);

}

let deleteCategoryID = 0
const deleteCategory = (categoryID, catTitle) => {
    // console.log(categoryID)
    $("#category-select-delete").html(catTitle);
    $("#delete-category-modal").modal('show');
    deleteCategoryID = categoryID;

}
const submitDeleteCategory = () => {

    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    axios.delete(`/api/manager/category/${deleteCategoryID}`, config)
        .then(() => {
            // console.log(response)
            $("#delete-category-modal").modal('hide')
            getCategories()
            getSubCategory()

            clearCategoryForm();

        })
        .catch(error => {
            console.log(error.response)
        })
}

//-- search category --//
$("#search-category").on('input',function(e){

    const search_text = $("#search-category").val();

    $(".tr-category").each((tr_idx,tr) => {

        $(tr).removeClass('d-none')

        if(($(tr).find('td').text()).indexOf(search_text) === -1){
            $(tr).addClass('d-none')
        }
    })
});


//---------------------------------------------------//
//-----    sub-category functions    ----------------//
//---------------------------------------------------//
let subCategories = ''
let shownSubCategories = []

//-- write to upload image lable --//
$('#sub-category-image').on('change',function(){
    //get the file name
    var fileName = $(this).val();
    //replace the "Choose a file" label
    $(this).next('.custom-file-label').html(fileName);
})

const getSubCategory = () => {
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
            $("#select-sub-category").append(`<option selected disabled>دسته بندی فرعی را انتخاب کنید</option>`)
            subCategories.map(sub => {
                $("#select-sub-category").append(`
                    <option name="${sub.name}" value="${sub.id}">${sub.name}</option>
                `)
            })
            fetchSubCategory()
        })
        .catch(error => {
            console.log(error.response)
        })
}

getSubCategory()

const fillSubCategoryForm = (arrayIndex, objID) =>{

    //console.log(arrayIndex, objID, JSON.stringify(subCategories[arrayIndex]))
    clearSubCategoryForm();

    $(".tr-sub-category").removeClass('table-primary');
    let selectedObj = "#" + objID;
    $(selectedObj).addClass('table-primary')

    $("#sub-category-id").val(shownSubCategories[arrayIndex].id);
    $("#sub-category-category").val(shownSubCategories[arrayIndex].category);

    if(shownSubCategories[arrayIndex].image) $("#img-sub-category-selected").attr('src', shownSubCategories[arrayIndex].image);

    if(shownSubCategories[arrayIndex].name != null) $("#sub-category-title").val(shownSubCategories[arrayIndex].name);

    if(shownSubCategories[arrayIndex].slug != null) $("#sub-category-en-title").val(shownSubCategories[arrayIndex].slug.replace('-', ' '));

    if(shownSubCategories[arrayIndex].image_alt != null) $("#sub-category-img-alt").val(shownSubCategories[arrayIndex].image_alt);

    if(shownSubCategories[arrayIndex].description != null) $("#sub-category-description").val(shownSubCategories[arrayIndex].description);

}

const clearSubCategoryForm = () =>{

    //-- clear inputs field and reset to default --//
    $("#errors-box").empty();

    //-- clear inputs field --//
    $('#form-add-sub-category-apc1').find('input:text, input:password, input:file, select, textarea').val('');
    $('#form-add-sub-category-apc1').find('input:text, input:password, input:file, select, textarea')
        .removeClass(" is-invalid")

    $('#form-add-sub-category-apc1').find('input:radio, input:checkbox')
         .removeAttr('checked').removeAttr('selected');
    $('#form-add-sub-category-apc1').find('input:checkbox').prop( "checked", false );
    $('#form-add-sub-category-apc1').find('label').html( "انتخاب فایل" );

    $('#form-add-sub-category-apc1').find('img').attr('src', "/static/assets/images/camera.svg");

    /*$('#form-add-category-apc1').find('input:text, input:password, input:file, input:hidden, select, textarea').each(function (){
        console.log(this)
    })*/
}

const fetchSubCategory = () => {
    $("#sub-category-tbody").empty()
    let categoryId = parseInt($("#select-category").val())
    // console.log(categoryId)
    let subCategoryIndex = 0
    shownSubCategories = []
    subCategories.map(subCategory => {
        if (subCategory['category'] === categoryId) {
            subCategoryIndex = subCategories.indexOf(subCategory)
            if (subCategoryIndex > -1) {
                shownSubCategories.push(subCategories[subCategoryIndex])
            }
        }
    })
    if (shownSubCategories.length === 0) {
        $("#sub-category-tbody").append(`
            <div class="mt-3">
                <strong class="text-muted">زیر دسته ای در این دسته وجود ندارد!</strong>
            </div>
        `)
    } else {
        shownSubCategories.map((sub, index) => {
            $("#sub-category-tbody").append(`
                <tr id="sub-category-${sub.id}" class="tr-sub-category" onclick="fillSubCategoryForm(${index}, 'sub-category-${sub.id}')">
                    <td style="width: 15%">${index + 1}</td>
                    <td style="width: 65%">${sub.name}</td>
                    <td style="width: 20%">
                        <div class="d-flex justify-content-around align-items-center">
                            <i class="fa fa-trash align-middle" onclick="deleteSubCategory(${sub.id}, '${sub.name}')"></i>
                        </div>
                    </td>
                </tr>
            `)
        })
    }
}

if ($("#select-category").val() === null) {
    $("#add-sub-category-modal-btn").attr('disabled', true)
}

$("#select-category").change(() => {

    //-- set selected category id --//
    $("#sub-category-category").val($("#select-category option:selected").val())

    fetchSubCategory()
    $("#add-sub-category-modal-btn").attr('disabled', false)
    const catName = $("#select-category option:selected").text()
    $("#cat-name-in-add-sub").text(catName)
})

const addSubCategory = () => {
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    let categoryId = $("#select-category option:selected").val() //$("#sub-category-category").val()
    let subCategoryName = $("#sub-category-title").val()
    let subCategoryEnName = $("#sub-category-en-title").val()
    let subCategoryImageAlt = $("#sub-category-img-alt").val();
    let subCategoryDescription = $("#sub-category-description").val()
    let formData = new FormData();
    let imageFile = $("#sub-category-image")[0].files[0]

    formData.append('name', subCategoryName)
    formData.append('slug', subCategoryEnName.replace(' ', '-'))
    if(imageFile != undefined){
        formData.append('image', imageFile);
    }
    formData.append('image_alt', subCategoryImageAlt)
    formData.append('description', subCategoryDescription)
    formData.append('category', categoryId)


    axios.post('/api/manager/sub-category/', formData, config)
        .then(async () => {
            // console.log(response)
            await getSubCategory()
            $("#add-sub-cat-modal").modal('hide')
            //-- clear inputs field --//
            clearSubCategoryForm();
            //-- show message --//
            showSnackbar( 'دسته بندی فرعی ' + subCategoryName + ' با موفقیت افزوده شد' , '#43a047')
        })
        .catch(error => {
            console.log(error.response)
            let err = error.response.data
            let errorTxt = Object.keys(err)
            //console.log(errorTxt)
            errorTxt.map(txt => {
                $(`input[name=${txt}]`).addClass(' is-invalid')
            })
        })
}

const editSubCategory = () => {

    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    let subcategoryID = $("#sub-category-id").val();
    if(subcategoryID == '') return
    let categoryID = $("#select-category option:selected").val() //$("#sub-category-category").val();
    let subcategoryName = $("#sub-category-title").val();
    let subcategoryEnName = $("#sub-category-en-title").val();
    let subcategoryImageAlt = $("#sub-category-img-alt").val();
    let subcategoryDescription = $("#sub-category-description").val();
    let formData = new FormData();
    let imageFile = $("#sub-category-image")[0].files[0]

    formData.append('name', subcategoryName)
    formData.append('slug', subcategoryEnName.replace(' ', '-'))
    console.log(($("#pic-sub-category-remove").prop('checked') == true), ' chkbox')
    if(imageFile != undefined){
        formData.append('image', imageFile);
    }
    else if($("#pic-sub-category-remove").prop('checked') == true){
        console.log("no image")
        formData.append('image', '')
    }
    formData.append('image_alt', subcategoryImageAlt)
    formData.append('category', categoryID)
    formData.append('description', subcategoryDescription)

    axios.put('/api/manager/sub-category/'+subcategoryID+'/', formData, config)
        .then(async () => {
            // console.log(response)
            //-- get all sub-category list --//
            await getSubCategory()
            //-- clear inputs field --//
            clearSubCategoryForm();
            //-- show message --//
            showSnackbar( 'دسته بندی ' + subcategoryName + ' با موفقیت تغییر داده شد' , '#43a047')
        })
        .catch(error => {
            console.log(error)
            console.log(error.response)
            let err = error.response.data
            let errorTxt = Object.keys(err)
            console.log(errorTxt)

            errorTxt.map(txt => {
                $(`input[name=${txt}]`).addClass(' is-invalid')
            })
        })
}

let deleteSubCategoryID = ''
const deleteSubCategory = (subCategoryID, catTitle) => {
    $("#sub-category-select-delete").html(catTitle);
    $("#delete-sub-category-modal").modal('show')
    deleteSubCategoryID = subCategoryID
}
const submitDeleteSubCategory = () => {
    // console.log(deleteSubCategoryID)
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    axios.delete(`/api/manager/sub-category/${deleteSubCategoryID}`, config)
        .then(() => {
            // console.log(response)
            getSubCategory()
            getSubSubCategory()
            $("#delete-sub-category-modal").modal('hide')
            clearSubCategoryForm();
        })
        .catch(error => {
            console.log(error)
        })
}

//-- search category --//
$("#search-sub-category").on('input',function(e){

    const search_text = $("#search-sub-category").val();

    $(".tr-sub-category").each((tr_idx,tr) => {

        $(tr).removeClass('d-none')

        if(($(tr).find('td').text()).indexOf(search_text) === -1){
            $(tr).addClass('d-none')
        }
    })
});


//---------------------------------------------------//
//-----    sub-sub-category functions    ------------//
//---------------------------------------------------//
let subSubCategories = ''
let shownSubSubCategories = []

//-- write to upload image lable --//
$('#sub-sub-category-image').on('change',function(){
    //get the file name
    var fileName = $(this).val();
    //replace the "Choose a file" label
    $(this).next('.custom-file-label').html(fileName);
})

const getSubSubCategory = () => {
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    axios.get('/api/manager/sub-sub-category/', config)
        .then((response) => {
            // console.log(response.data)
            subSubCategories = response.data.results
            fetchSubSubCategories()
        })
        .catch(error => {
            console.log(error.response)
        })
}

getSubSubCategory()

const fillSubSubCategoryForm = (arrayIndex, objID) =>{

    //console.log(arrayIndex, objID, JSON.stringify(subCategories[arrayIndex]))
    clearSubSubCategoryForm();

    $(".tr-sub-sub-category").removeClass('table-primary');
    let selectedObj = "#" + objID;
    $(selectedObj).addClass('table-primary')

    $("#sub-sub-category-id").val(shownSubSubCategories[arrayIndex].id);
    $("#sub-sub-category-category").val(shownSubSubCategories[arrayIndex].category);

    if(shownSubSubCategories[arrayIndex].image) $("#img-sub-sub-category-selected").attr('src', shownSubSubCategories[arrayIndex].image);

    if(shownSubSubCategories[arrayIndex].name != null) $("#sub-sub-category-title").val(shownSubSubCategories[arrayIndex].name);

    if(shownSubSubCategories[arrayIndex].slug != null) $("#sub-sub-category-en-title").val(shownSubSubCategories[arrayIndex].slug.replace('-', ' '));

    if(shownSubSubCategories[arrayIndex].image_alt != null) $("#sub-sub-category-img-alt").val(shownSubSubCategories[arrayIndex].image_alt);

    if(shownSubSubCategories[arrayIndex].description != null) $("#sub-sub-category-description").val(shownSubSubCategories[arrayIndex].description);

}

const clearSubSubCategoryForm = () =>{

    //-- clear inputs field --//
    $('#form-add-sub-sub-category-apc1').find('input:text, input:password, input:file, select, textarea').val('');
    $('#form-add-sub-sub-category-apc1').find('input:text, input:password, input:file, select, textarea')
        .removeClass(" is-invalid")

    $('#form-add-sub-sub-category-apc1').find('input:radio, input:checkbox')
         .removeAttr('checked').removeAttr('selected');
    $('#form-add-sub-sub-category-apc1').find('input:checkbox').prop( "checked", false );
    $('#form-add-sub-sub-category-apc1').find('label').html( "انتخاب فایل" );

    $('#form-add-sub-sub-category-apc1').find('img').attr('src', "/static/assets/images/camera.svg");

    /*$('#form-add-category-apc1').find('input:text, input:password, input:file, input:hidden, select, textarea').each(function (){
        console.log(this)
    })*/
}

const fetchSubSubCategories = () => {
    $("#sub-sub-category-tbody").empty()
    let subCategoryId = parseInt($("#select-sub-category").val())
    let subSubCategoryIndex = 0
    shownSubSubCategories = []
    subSubCategories.map(subSubCategory => {
        if (subSubCategory['sub_category'] === subCategoryId) {
            subSubCategoryIndex = subSubCategories.indexOf(subSubCategory)
            if (subSubCategoryIndex > -1) {
                shownSubSubCategories.push(subSubCategories[subSubCategoryIndex])
            }
        }
    })
    if (shownSubSubCategories.length === 0) {
        $("#sub-sub-category-tbody").append(`
            <div class="mt-3">
                <strong class="text-muted">زیر دسته ای در این دسته وجود ندارد!</strong>
            </div>
        `)
    } else {
        shownSubSubCategories.map((sub, index) => {
            $("#sub-sub-category-tbody").append(`
                <tr id="sub-sub-category-${sub.id}" class="tr-sub-sub-category" onclick="fillSubSubCategoryForm(${index}, 'sub-sub-category-${sub.id}')">
                    <td style="width: 15%">${index + 1}</td>
                    <td style="width: 65%">${sub.name}</td>
                    <td style="width: 20%">
                        <div class="d-flex justify-content-around align-items-center">
                            <i class="fa fa-trash align-middle" onclick="deleteSubSubCategory(${sub.id}, '${sub.name}')"></i>
                        </div>
                    </td>
                </tr>
            `)
        })
    }
}

if ($("#select-category").val() === null) {
    $("#add-sub-sub-category-modal-btn").attr('disabled', true)
}

$("#select-sub-category").change(() => {
    //-- set selected category id --//
    $("#sub-sub-category-parent").val($("#select-sub-category option:selected").val())

    fetchSubSubCategories()
    $("#add-sub-sub-category-modal-btn").attr('disabled', false)
    const subCatName = $("#select-sub-category option:selected").text()
    $("#sub-cat-name-in-add-sub").text(subCatName)
})

const addSubSubCategory = () => {
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    let subCategoryId = $("#select-sub-category").val()
    let subSubCategoryName = $("#sub-sub-category-title").val()
    let subSubCategoryEnName = $("#sub-sub-category-en-title").val()
    let subSubCategoryImageAlt = $("#sub-sub-category-img-alt").val();
    let subSubCategoryReturnTime = $("#sub-sub-category-return-time").val();
    let subSubCategoryDescription = $("#sub-sub-category-description").val()
    let formData = new FormData();
    let imageFile = $("#sub-sub-category-image")[0].files[0]

    formData.append('name', subSubCategoryName)
    formData.append('slug', subSubCategoryEnName.replace(' ', '-'))
    if(imageFile != undefined){
        formData.append('image', imageFile);
    }
    formData.append('image_alt', subSubCategoryImageAlt)
    formData.append('returned_time', subSubCategoryReturnTime)
    formData.append('description', subSubCategoryDescription)
    formData.append('sub_category', subCategoryId)


    axios.post('/api/manager/sub-sub-category/', formData, config)
        .then(async () => {
            // console.log(response)
            await getSubSubCategory()
            $("#add-sub-sub-cat-modal").modal('hide')
            //-- clear inputs field --//
            clearSubSubCategoryForm();
            //-- show message --//
            showSnackbar( 'دسته بندی فرعی ' + subSubCategoryName + ' با موفقیت افزوده شد' , '#43a047')

        })
        .catch(error => {
            console.log(error.response)
            let err = error.response.data
            let errorTxt = Object.keys(err)
            //console.log(errorTxt)
            errorTxt.map(txt => {
                $(`input[name=${txt}]`).addClass(' is-invalid')
            })
        })
}

const editSubSubCategory = () => {
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    let subCategoryId = $("#select-sub-category").val()
    let subSubCategoryId = $("#sub-sub-category-id").val()
    if(subSubCategoryId == '') return
    let subSubCategoryName = $("#sub-sub-category-title").val()
    let subSubCategoryEnName = $("#sub-sub-category-en-title").val()
    let subSubCategoryImageAlt = $("#sub-sub-category-img-alt").val();
    let subSubCategoryReturnTime = $("#sub-sub-category-return-time").val();
    let subSubCategoryDescription = $("#sub-sub-category-description").val()
    let formData = new FormData();
    let imageFile = $("#sub-sub-category-image")[0].files[0]

    formData.append('name', subSubCategoryName)
    formData.append('slug', subSubCategoryEnName.replace(' ', '-'))
    if(imageFile != undefined){
        formData.append('image', imageFile);
    }
    formData.append('image_alt', subSubCategoryImageAlt)
    formData.append('returned_time', subSubCategoryReturnTime)
    formData.append('description', subSubCategoryDescription)
    formData.append('sub_category', subCategoryId)


    axios.put('/api/manager/sub-sub-category/'+subSubCategoryId+'/', formData, config)
        .then(async () => {
            // console.log(response)
            await getSubSubCategory()

            //-- clear inputs field --//
            clearSubSubCategoryForm();
            //-- show message --//
            showSnackbar( 'دسته بندی ' + subSubCategoryName + ' با موفقیت تغییر داده شد' , '#43a047')

        })
        .catch(error => {
            console.log(error.response)
            let err = error.response.data
            let errorTxt = Object.keys(err)
            //console.log(errorTxt)
            errorTxt.map(txt => {
                $(`input[name=${txt}]`).addClass(' is-invalid')
            })
        })
}

let deleteSubSubCategoryID = ''
const deleteSubSubCategory = (subSubCategoryID, catTitle) => {
    $("#sub-sub-category-select-delete").html(catTitle);
    $("#delete-sub-sub-category-modal").modal('show')
    deleteSubSubCategoryID = subSubCategoryID
}
const submitDeleteSubSubCategory = () => {
    // console.log(deleteSubCategoryID)
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    axios.delete(`/api/manager/sub-sub-category/${deleteSubSubCategoryID}`, config)
        .then(() => {
            // console.log(response)
            getSubSubCategory()
            $("#delete-sub-sub-category-modal").modal('hide')
            clearSubSubCategoryForm();
        })
        .catch(error => {
            console.log(error)
        })
}

//-- search category --//
$("#search-sub-sub-category").on('input',function(e){

    const search_text = $("#search-sub-sub-category").val();

    $(".tr-sub-sub-category").each((tr_idx,tr) => {

        $(tr).removeClass('d-none')

        if(($(tr).find('td').text()).indexOf(search_text) === -1){
            $(tr).addClass('d-none')
        }
    })
});