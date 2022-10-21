let brands;

//-- write to upload image lable --//
$('#brand-image').on('change',function(){
    //get the file name
    var fileName = $(this).val();
    //replace the "Choose a file" label
    $(this).next('.custom-file-label').html(fileName);
})

const getBrands = async () => {
    const response = await sendRequest({
        method: 'GET',
        auth: true,
        url: 'manager/brand/'
    })
    if (response) {
        $("#brand-tbody").empty()
        brands = response['results']
        brands.map((brand, index) => {
            $("#brand-tbody").append(`
                <tr id="brand-${brand.id}" class="tr-brand" onclick="fillBrandForm(${index}, 'brand-${brand.id}')">
                    <td style="width: 15%;">${index + 1}</td>
                    <td style="width: 35%">${brand.fa_name}</td>
                    <td style="width: 30%">${brand.en_name}</td>
                    <td style="width: 15%">
                        <div class="d-flex justify-content-around align-items-center">
                            <i class="fa fa-trash align-middle" onclick="deleteBrand(${brand.id}, '${brand.fa_name}')"></i>
                        </div>
                    </td>
                </tr>
            `)
        })
    }
}

window.onload = getBrands

const addBrand = async () => {
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }

    let brandName = $("#brand-fa-title").val()
    let brandEnTitle = $("#brand-en-title").val()
    let brandDescription = $("#brand-description").val()
    let brandImageAlt = $("#brand-img-alt").val();
    let formData = new FormData();
    let imageFile = $("#brand-image")[0].files[0]

    console.log(brandEnTitle)
    formData.append('fa_name', brandName)
    formData.append('logo_alt', brandImageAlt)
    formData.append('en_name', brandEnTitle)
    if(imageFile != undefined){
        formData.append('logo', imageFile);
    }
    else{
        formData.append('logo', '');
    }
    formData.append('description', brandDescription)

    axios.post('/api/manager/brand/', formData, config)
        .then(async () => {
            // console.log(response)
            await getBrands();

            //-- clear inputs field --//
            clearBrandForm();
            //-- show message --//
            showSnackbar( 'برند ' + brandName + ' با موفقیت افزوده شد' , '#43a047')
        })
        .catch(error => {
            console.log(error.response)
            let err = error.response.data
            let errorTxt = Object.keys(err)
            console.log(errorTxt)
            errorTxt.map(txt => {
                $(`input[name=${txt}]`).addClass('is-invalid')
            })
        })

}

const editBrand = async () => {
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }

    let brandID = $("#brand-id").val();
    if(brandID == '') return
    let brandName = $("#brand-fa-title").val()
    let brandEnTitle = $("#brand-en-title").val()
    let brandDescription = $("#brand-description").val()
    let brandImageAlt = $("#brand-img-alt").val();
    let formData = new FormData();
    let imageFile = $("#brand-image")[0].files[0]

    formData.append('fa_name', brandName)
    formData.append('en_name', brandEnTitle)
    if(imageFile != undefined){
        formData.append('logo', imageFile);
    }
    else if($("#pic-remove").prop('checked') == true){
        formData.append('logo', '')
    }
    formData.append('logo_alt', brandImageAlt)
    formData.append('description', brandDescription)

    axios.put('/api/manager/brand/'+brandID+'/', formData, config)
        .then(async () => {
            // console.log(response)
            await getBrands();

            //-- clear inputs field --//
            clearBrandForm();
            //-- show message --//
            showSnackbar( 'برند ' + brandName + ' با موفقیت تغییر داده شد' , '#43a047')
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

const clearBrandForm = () => {
    
    //-- clear inputs field --//
    $('#form-add-brand-apc').find('input:text, input:password, input:file, input:hidden, select, textarea').val('');
    $('#form-add-brand-apc').find('input:text, input:password, input:file, input:hidden, select, textarea')
        .removeClass("is-invalid")

    $('#form-add-brand-apc').find('input:radio, input:checkbox')
         .removeAttr('checked').removeAttr('selected');
    $('#form-add-brand-apc').find('input:checkbox').prop( "checked", false );
    $('#form-add-brand-apc').find('label').html( "انتخاب فایل" );

    $('#form-add-brand-apc').find('img').attr('src', "/static/assets/images/camera.svg");

    /*$('#form-add-brand-apc').find('input:text, input:password, input:file, input:hidden, select, textarea').each(function (){
        console.log(this)
    })*/
}

const fillBrandForm = (arrayIndex, trID) => {
    //console.log(JSON.stringify(brands[arrayIndex]))

    clearBrandForm();

    $(".tr-brand").removeClass('table-primary');
    let selectedObj = "#" + trID;
    $(selectedObj).addClass('table-primary')

    $("#brand-id").val(brands[arrayIndex].id);

    if(brands[arrayIndex].logo) $("#img-brand-selected").attr('src', brands[arrayIndex].logo);

    if(brands[arrayIndex].fa_name != null) $("#brand-fa-title").val(brands[arrayIndex].fa_name);

    if(brands[arrayIndex].en_name != null) $("#brand-en-title").val(brands[arrayIndex].en_name);

    if(brands[arrayIndex].logo_alt != null) $("#brand-img-alt").val(brands[arrayIndex].logo_alt);

    if(brands[arrayIndex].description != null) $("#brand-description").val(brands[arrayIndex].description);

}

let deleteBrandID = 0
const deleteBrand = (brandID, title) => {
    $("#brand-select-delete").html(title)
    $("#delete-brand-modal").modal('show')
    deleteBrandID = brandID
}
const submitDeleteBrand = async () => {
    const response = await sendRequest({
        method: 'DELETE',
        url: `manager/brand/${deleteBrandID}/`
    })
    if (response) {
        await getBrands()
        $("#delete-brand-modal").modal('hide')
        clearBrandForm();
    }
}

//-- search brand --//
$("#search-brand").on('input',function(e){

    const search_text = $("#search-brand").val();

    $(".tr-brand").each((tr_idx,tr) => {

        $(tr).removeClass('d-none')

        if(($(tr).find('td').text()).indexOf(search_text) === -1){
            $(tr).addClass('d-none')
        }
    })
});
