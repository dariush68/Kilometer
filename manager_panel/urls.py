from django.conf.urls import url
from . import views
from django.views.generic.base import RedirectView

app_name = 'manager_panel'

urlpatterns = [
    url(r'^$', views.management_panel, name='managementPanel'),
    url(r'^personal-info/$', views.personal_info, name='personalInfo'),
    url(r'^additional-info/$', views.additional_info, name='additionalInfo'),
    url(r'^all-orders/$', views.all_orders, name='allOrders'),
    url(r'^returned-orders/$', views.returned_orders, name='returnedOrders'),
    url(r'^favorite-products/$', views.favorite_products, name='favoriteProducts'),
    url(r'^add-product-category/$', views.add_product_category, name='addProductCategory'),
    url(r'^add-brand/$', views.add_brand, name='addBrand'),
    url(r'^add-color/$', views.add_color, name='addColor'),
    url(r'^add-tag/$', views.add_tag, name='addTag'),
    url(r'^add-slideshow/$', views.add_slideshow, name='addSlideshow'),
    url(r'^products-list/$', views.products_list, name='productsList'),
    url(r'^add-product/$', views.add_product, name='addProduct'),
    url(r'^users-list/$', views.users_list, name='usersList'),
]
