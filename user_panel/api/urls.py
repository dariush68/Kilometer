from django.conf.urls import url
from django.urls import path, include
from rest_framework import routers
from store.models import User

from . import views

app_name = 'api-user'

router = routers.DefaultRouter()
router.register('returned-ware', views.ReturnedWareViewSet)
router.register('address', views.UserAddressViewSet)
router.register('favorite-ware', views.FavoriteWareViewSet)
router.register('resend-code', views.ResendCodeViewSet)

urlpatterns = [
    path('info/', views.UserInfoView.as_view(), name='user_create'),
    # path('login/', views.LoginAPIView.as_view(), name='user_login'),
    path('signup/', views.SignUpAPIView.as_view(), name='user_signup'),
    path('verify-user/', views.UserPhoneRegisterAPIView.as_view(), name='verifyUser'),
    # path('address/', views.UserAddressAPIView.as_view(), name='address'),
    # path('address/<int:pk>/', views.UpdateUserAddressView.as_view(), name='update-address'),
    path('isAdmin/', views.IsManagerAPIView.as_view(), name='isAdmin'),
    path('sales/', views.SaleListAPIView.as_view(), name='sales-lists'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    path('', include(router.urls)),
]
