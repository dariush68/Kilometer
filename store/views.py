import os

from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError
from django.http import HttpResponse
from django.shortcuts import render
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.contrib.auth.views import PasswordContextMixin

from django.views.generic import FormView
from django.views.decorators.csrf import csrf_protect

from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _

from django.urls import reverse_lazy

from . import models
from .forms import PasswordResetForm

import pandas as pd

from urllib.request import urlopen
from bs4 import BeautifulSoup

UserModel = get_user_model()


def home(request):
    return render(request, 'store/home.html', {})


def error_404(request):
    return render(request, 'store/error-404.html')


def single_product(request, pk):
    return render(request, 'store/single-product.html')


def sub_category_products(request, pk):
    return render(request, 'store/sub-category-products.html')


class PasswordResetView(PasswordContextMixin, FormView):
    form_class = PasswordResetForm
    success_url = reverse_lazy('password_reset_done')
    template_name = 'user_panel/forgot-password.html'
    token_generator = default_token_generator
    title = _('Password reset')

    @method_decorator(csrf_protect)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def form_valid(self, form):
        phone_number = form.cleaned_data['phone_number']
        try:
            user = UserModel.objects.get(phone_number=phone_number)
            opts = {
                'use_https': self.request.is_secure(),
                'token_generator': self.token_generator,
                'request': self.request,
            }
            form.save(**opts)
        except UserModel.DoesNotExist:
            form.add_error(None, 'این شماره موبایل پیدا نشد!')
            return self.form_invalid(form)
        return super().form_valid(form)


def cart(request):
    return render(request, 'store/cart.html')


def global_search(request):
    return render(request, 'store/global-search-products.html')


def category_products(request, slug):
    try:
        models.Category.objects.get(slug=slug)
        return render(request, 'store/category-products.html')
    except ObjectDoesNotExist:
        pass
        # sub category
    try:
        models.SubCategory.objects.get(slug=slug)
        return render(request, 'store/sub-category-products.html')
    except ObjectDoesNotExist:
        pass

        # sub sub category
    try:
        models.SubSubCategory.objects.get(slug=slug)
        return render(request, 'store/sub-category-products.html')
    except ObjectDoesNotExist:
        pass

    return render(request, 'store/error-404.html')
    # return render(request, 'store/category-products.html')


def scrape_products(request):

    # directory = os.listdir('.')
    # print(directory)

    excel = pd.read_excel('./store/Price_Update_August-2020.xlsx', header=1)

    for index, row in excel[['كد كالا', 'COST PRICE U$']].iterrows():
        try:
            price = row['COST PRICE U$']
            ware_code = row['كد كالا']
            ware = models.Ware.objects.create(id=ware_code)
            models.Product.objects.create(ware=ware, price=price)
            # print(row['كد كالا'], row['COST PRICE U$'])
        except IntegrityError:
            continue
        except ValueError:
            continue

    return HttpResponse('Scrap is complete!')


def scrape_dollar():
    url = 'https://www.tgju.org/profile/price_dollar_rl'

    page = urlopen(url)

    html_bytes = page.read()
    html = html_bytes

    soup = BeautifulSoup(html, "html.parser")

    dollar = soup.find('span', {'class': 'value'}).find('span').get_text().replace(',', '')

    dollar_obj = models.Dollar.objects.all()

    if dollar_obj.count() == 0:
        models.Dollar.objects.create(real_price=dollar)
    else:
        dollar_obj[0].real_price = dollar

    print('Scraped!')

