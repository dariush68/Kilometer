const tagConfig = {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    },
}
const getTags = async () => {
    $("#tag-tbody").empty()
    const response = await sendRequest({
        method: 'GET',
        auth: true,
        url: 'manager/tag/'
    })
    if (response) {
        const tags = response.results
        if (tags.length === 0) {
            $("#tags-container").append(`
                <div class="alert alert-warning w-100 text-center">موردی یافت نشد</div>
            `)
        }
        tags.forEach((tag, index) => {
            $("#tag-tbody").append(`
                <tr id="tag-${tag.id}">
                    <td style="width: 100px">${index + 1}</td>
                    <td>${tag['fa_name']}</td>
                    <td>
                        ${tag['en_name']}
                    </td>
                    <td class="">
                        <div class="d-flex justify-content-center align-items-center">
                            <button class="btn-sm btn btn-danger w-50" onclick="deleteTag(${tag.id})">
                                حذف
                            </button>
                            <button class="btn-sm btn btn-warning w-50" onclick="editTag(${tag.id}, '${tag.en_name}', '${tag.fa_name}')">
                                ویرایش
                            </button>
                        </div>
                    </td>
                </tr>
            `)
        })
    }
}
getTags()

const addTag = async () => {
    $("#snackbar").empty();
    const faName = $("#add-tag-fa-name").val()
    const enName = $("#add-tag-en-name").val()
    if (faName === '' || enName === '') {
        showSnackbar('لطفا نام فارسی و انگلیسی تگ را وارد کنید')
    } else {
        const data = {
            fa_name: faName,
            en_name: enName,
            slug: enName.replace(' ', '-')
        }
        const response = await sendRequest({
            method: 'POST',
            url: 'manager/tag/',
            data: data
        })
        if (response) {
            await getTags()
            $("#add-tag-modal").modal('hide')
        }
    }
}

$("#add-new-tag-btn").click(() => {
    $("#add-tag-modal").modal('show')
})

let editTagId = undefined;
const editTag = (id, enName, faName) => {
    $("#snackbar").empty();
    $("#edit-tag-fa-name").val(faName)
    $("#edit-tag-en-name").val(enName)
    $("#edit-tag-modal").modal('show')
    editTagId = id

}
const submitEditTag = async () => {
    const newFaName = $("#edit-tag-fa-name").val()
        const newEnName = $("#edit-tag-en-name").val()
        if (newFaName === '' || newEnName === '') {
            showSnackbar('لطفا نام فارسی و انگلیسی تگ را وارد کنید')
        } else {
            const data = {
                fa_name: newFaName,
                en_name: newEnName,
                slug: newEnName.replace(' ', '-')
            }
            const response = await sendRequest({
                method: 'PUT',
                url: `manager/tag/${editTagId}/`,
                data: data
            })
            if (response) {
                await getTags()
                $("#edit-tag-modal").modal('hide')
            }
        }
}

let deleteTagId = undefined
const deleteTag = (id) => {
    $("#delete-tag-modal").modal('show')
    deleteTagId = id
}
const submitDeleteTag = async () => {
    const response = await sendRequest({
        method: 'DELETE',
        url: `manager/tag/${deleteTagId}/`
    })
    if (response) {
        await getTags()
        $("#delete-tag-modal").modal('hide')
    }
}