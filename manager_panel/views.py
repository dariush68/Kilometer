from django.shortcuts import render


def management_panel(request):
    return render(request, 'manager_panel/management-panel.html', {})


def personal_info(request):
    return render(request, 'manager_panel/personal-info.html')


def additional_info(request):
    return render(request, 'manager_panel/additional-info.html')


def all_orders(request):
    return render(request, 'manager_panel/all-orders.html')


def returned_orders(request):
    return render(request, 'manager_panel/returned-orders.html')


def favorite_products(request):
    return render(request, 'manager_panel/favorite-products.html')


def add_product_category(request):
    return render(request, 'manager_panel/add-product-category.html')


def add_product(request):
    return render(request, 'manager_panel/add-product.html')


def users_list(request):
    return render(request, 'manager_panel/users-list.html')


def products_list(request):
    return render(request, 'manager_panel/products-list.html')


def add_brand(request):
    return render(request, 'manager_panel/add-brand.html')


def add_color(request):
    return render(request, 'manager_panel/add-color.html')


def add_tag(request):
    return render(request, 'manager_panel/add-tag.html')


def add_slideshow(request):
    return render(request, 'manager_panel/add-slideshow.html')