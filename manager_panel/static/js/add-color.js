let colors;

//-- init color picker --//
var xncolorpicker = new XNColorPicker({
        color: "#008867",
        selector: "#colorpicker",
        showprecolor: true,//显示预制颜色
        prevcolors: null,//预制颜色，不设置则默认
        showhistorycolor: true,//显示历史
        historycolornum: 8,//历史条数
        format: 'hex',//rgba hex hsla
        showPalette:true,//显示色盘
        show:false, //初始化显示
        lang:'en',// cn 、en
        colorTypeOption:'single,linear-gradient,radial-gradient',
        canMove:false,//选择器位置是否可以拖拽
        alwaysShow:false,
        autoConfirm:true,
        onError: function (e) {

        },
        onCancel:function(color){
            console.log("cancel",color)
        },
        onChange:function(color){
            console.log("change",color)
        },
        onConfirm:function(color){
            console.log("confirm",color)
            console.log("confirm",color.color['hex'])

            $("#color-hex").val(color.color['hex']);
        }
    })


const componentToHex = (c) => {
    let hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}
const rgbToHex = (r, g, b) => {
    return `${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

const getColors = async () => {
    $("#color-tbody").empty()
    const response = await sendRequest({
        method: 'GET',
        url: 'manager/color/',
        auth: true
    })
    if (response) {
        colors = response.results
        colors.map((color, index) => {
            let colorCode = `#${color.hex_code}`
            $("#color-tbody").append(`
                <tr id="color-${color.id}" class="tr-color" onclick="fillColorForm(${index}, 'color-${color.id}')">
                    <td style="width: 15%" style="width: 100px">${index + 1}</td>
                    <td style="width: 35%">${color.name}</td>
                    <td style="width: 30%">
                        <div class="d-flex mx-auto"
                            style="background-color: ${colorCode}; width: 24px; height: 24px; border-radius: 10%; border: 2px solid darkgrey"></div>
                    </td>
                    <td style="width: 20%" class="">
                        <div class="d-flex justify-content-around align-items-center">
                            <i class="fa fa-trash align-middle" onclick="deleteColor(${color.id}, '${color.name}')"></i>
                        </div>
                    </td>
                </tr>
            `)
        })
    }
}
getColors()

const addColor = async () => {
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }

    let colorName = $("#color-title").val()
    let colorCode = $("#color-hex").val().replace("#","");

    let data = {
        name: colorName,
        hex_code: colorCode
    }

    axios.post('/api/manager/color/', data, config)
        .then(async () => {
            // console.log(response)
            await getColors();

            //-- clear inputs field --//
            clearColorForm();
            //-- show message --//
            showSnackbar( 'رنگ ' + colorName + ' با موفقیت افزوده شد' , '#43a047')
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

const editColor = async () => {
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }

    let colorID = $("#color-id").val();
    if(colorID == '') return
    let colorName = $("#color-title").val()
    let colorCode = $("#color-hex").val().replace("#","");

    let data = {
        name: colorName,
        hex_code: colorCode
    }

    axios.put('/api/manager/color/'+colorID+'/', data, config)
        .then(async () => {
            // console.log(response)
            await getColors();

            //-- clear inputs field --//
            clearColorForm();
            //-- show message --//
            showSnackbar( 'رنگ ' + colorName + ' با موفقیت  تغییر داده شد' , '#43a047')
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

const clearColorForm = () => {

    //-- clear inputs field --//
    $('#form-add-color-apc').find('input:text, input:password, input:file, input:hidden, select, textarea').val('');
    $('#form-add-color-apc').find('input:text, input:password, input:file, input:hidden, select, textarea')
        .removeClass(" is-invalid")

    $('#form-add-color-apc').find('input:radio, input:checkbox')
         .removeAttr('checked').removeAttr('selected');
    $('#form-add-color-apc').find('input:checkbox').prop( "checked", false );
    $('#form-add-color-apc').find('label').html( "انتخاب فایل" );

    $('#form-add-color-apc').find('img').attr('src', "/static/assets/images/camera.svg");

    xncolorpicker.setColor("#434343")

    /*$('#form-add-color-apc').find('input:text, input:password, input:file, input:hidden, select, textarea').each(function (){
        console.log(this)
    })*/
}

const fillColorForm = (arrayIndex, trID) => {
    //console.log(JSON.stringify(brands[arrayIndex]))

    clearColorForm();

    $(".tr-color").removeClass('table-primary');
    let selectedObj = "#" + trID;
    $(selectedObj).addClass('table-primary')

    $("#color-id").val(colors[arrayIndex].id);

    // if(brands[arrayIndex].logo) $("#img-brand-selected").attr('src', brands[arrayIndex].logo);

    if(colors[arrayIndex].name != null) $("#color-title").val(colors[arrayIndex].name);

    if(colors[arrayIndex].hex_code != null) $("#color-hex").val(colors[arrayIndex].hex_code);

    xncolorpicker.setColor("#" + colors[arrayIndex].hex_code)

}

let deleteColorId = undefined;
const deleteColor = (colorID, title) => {
    deleteColorId = colorID;
    $("#color-select-delete").html(title)
    $("#delete-color-modal").modal('show')
}

const submitDeleteColor = async () => {
    const response = await sendRequest({
        method: 'DELETE',
        url: `manager/color/${deleteColorId}/`
    })
    if (response) {
        await getColors()
        $("#delete-color-modal").modal('hide')
        clearColorForm();
    }
}

//-- search color --//
$("#search-color").on('input',function(e){

    const search_text = $("#search-color").val();

    $(".tr-color").each((tr_idx,tr) => {

        $(tr).removeClass('d-none')

        if(($(tr).find('td').text()).indexOf(search_text) === -1){
            $(tr).addClass('d-none')
        }
    })
});