from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

app_name = 'api-manager'


router = DefaultRouter()
router.register('slide-show', views.ManagerSlideShowViewSet)
router.register('category', views.ManagerCategoryViewSet)
router.register('sub-category', views.ManagerSubCategoryViewSet)
router.register('sub-sub-category', views.ManagerSubSubCategoryViewSet)
router.register('brand', views.ManagerBrandViewSet)
router.register('ware', views.ManagerWareViewSet)
router.register('ware-picture', views.ManagerWarePictureViewSet)
router.register('price', views.ManagerPriceViewSet)
router.register('special-offer', views.ManagerSpecialOfferViewSet)
router.register('instant-offer', views.ManagerInstantOfferViewSet)
router.register('sale', views.ManagerSaleViewSet)
router.register('color', views.ManagerColorViewSet)
router.register('product', views.ManagerProductViewSet)
router.register('user', views.ManagerUserViewSet)
router.register('report', views.ManagerReportViewSet)
router.register('tag', views.ManagerTagViewSet)

urlpatterns = [
    path('info/', views.ManagerInfoView.as_view(), name='Info'),
    path('', include(router.urls)),
]

