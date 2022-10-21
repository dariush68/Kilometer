from django.conf.urls import url, re_path
from django.urls import path
from . import views
from django.contrib.auth.views import PasswordResetDoneView, PasswordResetConfirmView, PasswordResetCompleteView
from django.views.generic.base import RedirectView


app_name = 'store'

urlpatterns = [
    url(r'^$', views.home, name='home'),

    url(r'^error-404/$', views.error_404, name='error404'),
    re_path(r'product/(?P<pk>\w+)', views.single_product, name='singleProduct'),
    path('global-search/products/', views.global_search, name='globalSearch'),
    path('sub-category/<int:pk>/', views.sub_category_products, name='subCategory'),
    path('category/<str:slug>/', views.category_products, name='Category'),
    path('cart/', views.cart, name='cart'),
    path('password_reset/', views.PasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done/', PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('scrape-products/', views.scrape_products, name='scrape-product'),
    # re_path(
    #     r'product/(?P<pk>\w+)/(?P<slug>[-\w]+)/',
    #     TemplateView.as_view(template_name="store/single-product.html"),
    #     name='singleProduct'),
]
