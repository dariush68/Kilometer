from django.conf.urls import url
from . import views
from django.views.generic.base import RedirectView

app_name = 'user_panel'

urlpatterns = [
    url(r'^$', views.profile, name='profile'),
    url(r'^signup/$', views.signup, name='signup'),
    url(r'^welcome/$', views.welcome, name='welcome'),
    url(r'^login/$', views.login, name='login'),
    url(r'^profile-favorites/$', views.profile_favorites, name='profileFavorites'),
    url(r'^profile-orders/$', views.profile_orders, name='profileOrders'),
    url(r'^profile-personal-info/$', views.profile_personal_info, name='profilePersonalInfo'),
    url(r'^profile-additional-info/$', views.profile_additional_info, name='profileAdditionalInfo'),
    url(r'^profile-my-addresses/$', views.profile_my_addresses, name='profileMyAddresses'),
    url(r'^profile-orders-return/$', views.profile_orders_return, name='profileOrdersReturn'),
    url(r'^password-change/$', views.password_change, name='passwordChange'),
    url(r'^forgot-password/$', views.forgot_password, name='forgotPassword'),
    url(r'^verify-phone-number/$', views.verify_phone_number, name='verifyPhoneNumber'),


    url(r'^cart/$', views.cart, name='cart'),
    url(r'^checkout/$', views.checkout, name='checkout'),
]
