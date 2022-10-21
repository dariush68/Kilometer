from django.conf.urls import url
from django.urls import path, include
from rest_framework import routers

from . import views

app_name = 'api-store'

router = routers.DefaultRouter()
router.register('category', views.CategoryViewSet)
router.register('cart', views.UserCartViewSet)
router.register('sale', views.SaleViewSet)
# router.register('comment', views.WareCommentViewSet)
# router.register(r'address', views.UserAddressViewSet)


urlpatterns = [
    path('category/<str:slug>/', views.category_list, name='categoryList'),
    path('category/<str:slug>/ware/', views.ware_list, name='wareList'),
    path(
        'ware/<str:pk>/',
        views.WareRetrieveApiView.as_view(),
        name='ware-retrieve'
        ),
    path(
        'comment/',
        views.WareCommentListCreateAPIView.as_view(),
        name='ware-comment'
    ),
    path(
        'instant-offer/',
        views.InstantOfferListApiView.as_view(),
        name='instant-offer'
    ),
    path(
        'slide-show/',
        views.SlideShowImageListApiView.as_view(),
        name='slide-show'
    ),
    path(
        'sub-category/<int:pk>/ware/',
        views.WareRetrieveBySubCategoryApiView.as_view(),
        name='ware-retrieve-by-sub-category'
    ),
    path(
        'sub-sub-category/<int:pk>/ware/',
        views.WareRetrieveBySubSubCategoryApiView.as_view(),
        name='ware-retrieve-by-sub-sub-category'
    ),
    path(
        'tag/<str:slug>/ware/',
        views.WareRetrieveByTagApiView.as_view(),
        name='ware-retrieve-by-sub-sub-category'
    ),
    path(
        'sub-category/<int:pk>/',
        views.SubCategoryRetrieveApiView.as_view(),
        name='sub-category-retrieve'
    ),
    path(
        'sub-sub-category/<int:pk>/',
        views.SubSubCategoryRetrieveApiView.as_view(),
        name='sub-sub-category-retrieve'
    ),
    path(
        'sub-sub-category/<int:pk>/brand',
        views.SubSubCategoryBrandsRetrieveAPIView.as_view(),
        name='sub-sub-category-brand-retrieve'
    ),
    path(
        'ware/top-ware/',
        views.TopSevenWareListApiView.as_view(),
        name='top-five-ware-list'
    ),
    path(
        'forget-password/',
        views.ForgetPasswordAPIView.as_view(),
        name='forget-password'
    ),
    path(
        'report/',
        views.ReportAPIView.as_view(),
        name='report'
    ),
    path(
        'delete-cart/',
        views.DeleteCart.as_view(),
        name='DeleteCart'
    ),
    path(
        'global-search/',
        views.WareGlobalSearch.as_view(),
        name='global-search'
    ),
    path('', include(router.urls)),
]
