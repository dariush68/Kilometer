let userList = '';
const getUsersList = async () => {
    const response = await sendRequest({
        method: 'GET',
        url: 'manager/user-list/',
        auth: true
    })
    if (response) {
        let usersList = response
        userList = response
        usersList.map((user, index) => {
            $("#users-tbody").append(`
                <tr>
                    <td>${index + 1}</td>
                    <td>${user['name']}</td>
                    <td>${user['phone_number']}</td>
                    <td>${user['national_code']}</td>
                    <td>${user['email']}</td>
                    <td>${user['bank_card_number']}</td>
                    <td>
                        <button class="btn btn-sm btn-danger w-100" onclick="deleteUser(${user.id})">
                            حذف
                        </button>
                    </td>
                </tr>
            `)
        })
    }
}

window.onload = getUsersList

// Search user by name
$("#search-by-name").on('keyup' , () => {
    let name = $("#search-by-name").val()
    let searchedUsers = []
    userList.map(user => {
        if (user['name'].includes(name)) {
            let userSearchedIndex = userList.findIndex(usr => usr['name'] === user['name'])
            searchedUsers.push(userList[userSearchedIndex])
        }
    })
    $("#users-tbody").empty()
    searchedUsers.map((searchedUser, index) => {
        $("#users-tbody").append(`
            <tr>
                <td>${index + 1}</td>
                <td>${searchedUser['name']}</td>
                <td>${searchedUser['phone_number']}</td>
                <td>${searchedUser['national_code']}</td>
                <td>${searchedUser['email']}</td>
                <td>${searchedUser['bank_card_number']}</td>
                <td>
                    <button class="btn btn-sm btn-danger w-100" onclick="deleteUser(${searchedUser.id})">
                        حذف
                    </button>
                </td>
            </tr>
        `)
    })
})


// Search user by phone number
$("#search-by-phone").on('keyup' , () => {
    let phoneNumber = $("#search-by-phone").val()
    let searchedUsers = []
    userList.map(user => {
        if (user['phone_number'].includes(phoneNumber)) {
            let userSearchedIndex = userList.findIndex(usr => usr['phone_number'] === user['phone_number'])
            searchedUsers.push(userList[userSearchedIndex])
        }
    })
    $("#users-tbody").empty()
    searchedUsers.map((searchedUser, index) => {
        $("#users-tbody").append(`
            <tr>
                <td>${index + 1}</td>
                <td>${searchedUser['first_name'] + ' ' + searchedUser['last_name']}</td>
                <td>${searchedUser['phone_number']}</td>
                <td>${searchedUser['national_code']}</td>
                <td>${searchedUser['email']}</td>
                <td>${searchedUser['bank_card_number']}</td>
                <td>
                    <button class="btn btn-sm btn-danger w-100" onclick="deleteUser(${searchedUser.id})">
                        حذف
                    </button>
                </td>
            </tr>
        `)
    })
})

let deleteUserId = ''
const deleteUser = (userId) => {
    $("#make-sure").modal('show')
    deleteUserId = userId
}
const submitDeleteUser = async () => {
    const response = await sendRequest({
        method: 'DELETE',
        url: 'manager/user-list/'
    })
    if (response) {
        await getUsersList()
    }
}
