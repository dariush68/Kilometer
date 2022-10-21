const slideshowConfig = {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    },
}
const getSlideshow = async () => {
    $("#slideshow-container").empty()
    const response = await sendRequest({
        method: 'GET',
        auth: true,
        url: 'manager/slide-show'
    })
    if (response) {
        const slideshows = response.results
        if (slideshows.length === 0) {
            $("#slideshow-container").append(`
                <div class="alert alert-warning w-100 text-center">موردی یافت نشد</div>
            `)
        }
        slideshows.forEach(item => {
            $("#slideshow-container").append(`
                <div class="d-flex col col-12 col-lg-6 flex-column align-items-center">
                    <a href="${item.link}" >
                       <img src="${item.image}" class="slideshow-list-img w-100" alt="${item.link}">
                    </a>
                    <strong style="direction: ltr; font-family: 'Segoe UI'" class="mt-1 mb-2">${item.link}</strong>
                    <div class="d-flex w-50">
                        <button class="btn btn-sm btn-danger w-50" onclick="deleteSlideshow(${item.id})">
                            حذف
                        </button>
                        <button class="btn btn-sm btn-warning w-50"
                            onclick="editSlideshow(${item.id}, '${item.image}', '${item.link}', ${item.is_shown})"
                        >
                        ویرایش
                        </button>
                    </div>
                </div>
            `)
        })
    }
}
getSlideshow()

const getSlideshowImage = (input) => {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = function(e) {
            $(`#slideshow-preview`).css('background-image', 'url('+e.target.result +')');
            $(`#slideshow-preview`).hide();
            $(`#slideshow-preview`).fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
const getEditSlideshowImage = (input) => {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = function(e) {
            $(`#edit-slideshow-preview`).css('background-image', 'url('+e.target.result +')');
            $(`#edit-slideshow-preview`).hide();
            $(`#edit-slideshow-preview`).fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}



const addSlideshow = async () => {
    const link = $("#add-slideshow-link").val();
    const isShown = $("#slideshow-shown").prop('checked')
    const image = $("#slideshow-upload")[0].files[0]
    if (!image || link === '') {
        showSnackbar('لطفا عکس و لینک را انتخاب کنید')
    }
    if (image && link !== '') {
        let formData = new FormData()
        formData.append('image', image)
        formData.append('link', link)
        formData.append('is_shown', isShown)
        const response = await sendRequest({
            method: 'POST',
            url: 'manager/slide-show/',
            data: formData
        })
        if (response) {
            await getSlideshow()
            $("#add-slideshow-modal").modal('hide')
        }
    }
}

let deleteSlideshowId = undefined;
const deleteSlideshow = (id) => {
    $("#delete-slideshow-modal").modal('show')
    deleteSlideshowId = id
}

const submitSlideshowDelete = async () => {
    const response = await sendRequest({
        method: 'DELETE',
        url: `manager/slide-show/${deleteSlideshowId}/`
    })
    if (response) {
        await getSlideshow()
        $("#delete-slideshow-modal").modal('hide')
    }
}

let editSlideshowId = undefined
const editSlideshow = (id, image, link, checked) => {
    $("#edit-slideshow-modal").modal('show')
    $("#edit-slideshow-link").val(link)
    $(`#edit-slideshow-preview`).css('background-image', `url(${image})`)
    $("#edit-slideshow-shown").prop('checked', checked)
    editSlideshowId = id
}

const submitEditSlideshow = async () => {
    const link = $("#edit-slideshow-link").val();
    const isShown = $("#edit-slideshow-shown").prop('checked')
    const image = $("#edit-slideshow-upload")[0].files[0]
    const formData = new FormData()
    if (image) {
        formData.append('image', image)
    }
    formData.append('link', link)
    formData.append('is_shown', isShown)
    const response = await sendRequest({
        method: 'PATCH',
        urL: `manager/slide-show/${editSlideshowId}/`,
        data: formData
    })
    if (response) {
        await getSlideshow()
        $("#edit-slideshow-modal").modal('hide')
    }
}