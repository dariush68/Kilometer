const getFavorites = () => {
    $("#favorites-box").empty()
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
    }
    axios.get('/api/user/favorite-ware', config)
        .then(response => {
            let favorites = response.data
            if (favorites.length > 0) {
                favorites.map(favorite => {
                    $("#favorites-box").append(`
                        <div class="col-md-6 px-0 col-sm-12">
                            <div class="profile-recent-fav-row">
                                <div class="col-12 d-flex align-items-center justify-content-between" style="min-height: 100px">
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
                                <div class="col-12 text-left mb-3">
                                    <a href="/product/${favorite.ware.id}/${favorite.ware['slug']}" class="btn btn-info">مشاهده محصول</a>
                                </div>
                            </div>
                        </div>
                    `)
                })
            } else {
                $("#favorites-box").append(`
                    <div class="w-100 d-flex justify-content-center">
                        <strong class="alert alert-danger w-100 m-3 text-center">علاقه مندی های شما خالی است</strong>
                    </div>
                `)
            }
        })
        .catch(error => {
            console.log(error.response)
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
            if (response.status === 204) {
                getFavorites()
            }
        })
        .catch(error => {
            console.log(error.response)
        })
}