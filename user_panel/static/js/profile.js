const userProfileInfo = () => {

    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    axios.get('/api/user/info', config)
        .then(response => {
            // console.log(response)
            let userInfo = response.data;

            $("#main-profile-name").text(userInfo['name'])
            $("#main-profile-phone-number").text(userInfo['phone_number'])
            $("#main-profile-email").text(userInfo['email'])
            $("#main-profile-national-code").text(userInfo['national_code'])
            $("#main-profile-bank-card-number").text(userInfo['bank_card_number'])
        })
        .catch(error => {
            console.log('error: ', error.response)
            // if (error.response.status === 401) {
            //     newTokenGenerator()
            // }
        })
}

const getFavorites = () => {
    $("#favorites-box").empty()
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    axios.get('/api/user/favorite-ware', config)
        .then(response => {
            $("#last-favorites").empty()
            let favorites = response.data
            if (favorites.length > 0) {
                favorites.map((favorite, idx) => {
                    if (idx < 2) {
                        $("#last-favorites").append(`
                            <div class="profile-recent-fav-row">
                                <div class="col-12 px-0 d-flex align-items-center justify-content-between" style="min-height: 100px">
                                    <a href="/product/${favorite.ware.id}/${favorite.ware['slug']}" class="profile-recent-fav-col profile-recent-fav-col-thumb" style="min-width: 120px">
                                        <img src="${favorite.ware.thumbnail}" alt="${favorite.ware['name']}">
                                    </a>
                                    <div class="d-flex justify-content-start w-100">
                                        <strong class="profile-recent-fav-name">
                                            ${favorite.ware.name}
                                        </strong>
                                    </div>
                                    <button class="btn-action btn-action-remove" onclick="deleteFavorite(${favorite.id})">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        `)
                    }
                })
            } else {
                $("#last-favorites").append(`
                    <div class="w-100 d-flex justify-content-center">
                        <strong class="alert alert-danger w-100 m-3 text-center">علاقه مندی های شما خالی است</strong>
                    </div>
                `)
            }
        })
        .catch(error => {
            console.log(error)
        })
}

getFavorites()

const deleteFavorite = (id) => {
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    axios.delete(`/api/user/favorite-ware/${id}`, config)
        .then(response => {
            console.log(response)
            if (response.status === 204) {
                getFavorites()
            }
        })
        .catch(error => {
            console.log(error.response)
        })
}

window.onload = userProfileInfo