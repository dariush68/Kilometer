import datetime
import math
import operator
from random import randint

from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.db.models import Case, When
from django.http import JsonResponse, Http404
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status
from rest_framework import generics
from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view
import secrets
import string
from store import models
from . import serializers
from . import permissions
from kavenegar import KavenegarAPI, APIException, HTTPException
from kavenegar import json
from kilometer.settings import KAVENEGAR_APIKEY
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from .permissions import IsOwnerOrReadOnly

# import secrets


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


@api_view(['GET'])
def category_list(request, slug):
    """
        List and retrieve category, subcategory, subsubcategory
    """
    print(slug)

    # category
    try:
        obj = models.Category.objects.get(slug=slug)
        print('cat')
        obj_json = serializers.CategoryListSerializer(obj).data
        message = {
            'type': 'category',
            'data': obj_json
        }
        return Response(
            message,
            status=status.HTTP_200_OK
        )
    except ObjectDoesNotExist:
        pass

    # sub category
    try:
        obj = models.SubCategory.objects.get(slug=slug)
        print('sub-cat')
        obj_json = serializers.SubCategorySerializer(obj).data
        message = {
            'type': 'sub-category',
            'data': obj_json
        }
        return Response(
            message,
            status=status.HTTP_200_OK
        )
    except ObjectDoesNotExist:
        pass

    # sub sub category
    try:
        obj = models.SubSubCategory.objects.get(slug=slug)
        print('subsubcat')
        obj_json = serializers.SubSubCategorySerializer(obj).data
        message = {
            'type': 'sub-sub-category',
            'data': obj_json
        }
        return Response(
            message,
            status=status.HTTP_200_OK
        )
    except ObjectDoesNotExist:
        pass
    
    return Response(
        {
            'error': 'دسته بندی وجود ندارد!'
        },
        status=status.HTTP_404_NOT_FOUND
    )


@api_view(['GET'])
def ware_list(request, slug):
    """
        List ware for category, subcategory, subsubcategory
    """
    print(slug)

    # category
    try:
        category = models.Category.objects.get(slug=slug)
        ware_obj = models.Ware.objects.filter(sub_sub_category__sub_category__category=category)
        obj_json = serializers.BaseWareSerializer(ware_obj, many=True).data
        return Response(
            obj_json,
            status=status.HTTP_200_OK
        )
    except ObjectDoesNotExist:
        pass

    # sub category
    try:
        sub_category = models.SubCategory.objects.get(slug=slug)
        ware_obj = models.Ware.objects.filter(sub_sub_category__sub_category=sub_category)
        obj_json = serializers.BaseWareSerializer(ware_obj, many=True).data
        return Response(
            obj_json,
            status=status.HTTP_200_OK
        )
    except ObjectDoesNotExist:
        pass

    # sub sub category
    try:
        sub_sub_category = models.SubSubCategory.objects.get(slug=slug)
        ware_obj = models.Ware.objects.filter(sub_sub_category=sub_sub_category)
        obj_json = serializers.BaseWareSerializer(ware_obj, many=True).data
        return Response(
            obj_json,
            status=status.HTTP_200_OK
        )
    except ObjectDoesNotExist:
        pass
    
    return Response(
        {
            'error': 'دسته بندی وجود ندارد!'
        },
        status=status.HTTP_404_NOT_FOUND
    )


class SlideShowImageListApiView(generics.ListAPIView):
    """List slideshow images"""

    serializer_class = serializers.SlideShowSerializer
    authentication_classes = (JWTAuthentication,)
    queryset = models.SlideShow.objects.filter(is_shown=True)


class CategoryViewSet(viewsets.GenericViewSet,
                      mixins.ListModelMixin):
    """List category"""

    authentication_classes = (JWTAuthentication,)
    serializer_class = serializers.CategoryListSerializer
    pagination_class = StandardResultsSetPagination
    queryset = models.Category.objects.all()

    # def get_serializer_class(self):
    #     if self.action == 'list':
    #         return serializers.CategoryListSerializer
    #     else:
    #         return serializers.CategoryRetrieveSerializer


# class SpecialOfferView(generics.ListAPIView):
#     """List special offer"""
#
#     serializer_class = serializers.SpecialOfferSerializer
#     authentication_classes = (JWTAuthentication,)
#     pagination_class = StandardResultsSetPagination
#     queryset = models.SpecialOffer.objects.all()
#
#
# class TopFiveSpecialOfferView(generics.ListAPIView):
#     """List top 5 special offer"""
#     serializer_class = serializers.SpecialOfferSerializer
#     authentication_classes = (JWTAuthentication,)
#     queryset = models.SpecialOffer.objects.all().order_by('-off')[:5]

class InstantOfferListApiView(generics.ListAPIView):
    """List instant offers wares"""

    serializer_class = serializers.InstantOfferSerializer
    authentication_classes = (JWTAuthentication,)
    queryset = models.InstantOffer.objects.filter(deadline__gte=datetime.datetime.now())


class TopSevenWareListApiView(generics.ListAPIView):
    """List top 7 ware by view"""

    serializer_class = serializers.SubSubCategoryMainPageSerializer
    authentication_classes = (JWTAuthentication,)
    queryset = models.SubSubCategory.objects.all()

    # def get_queryset(self):
    #     """Return objects"""
    #     sub_category_id = self.request.query_params.get('sub-category')
    #     queryset = self.queryset
    #     if sub_category_id:
    #         queryset = queryset.filter(sub_category_id=sub_category_id)
    #
    #     # return queryset.order_by('-view')[:5]
    #     return queryset


class WareGlobalSearch(generics.ListAPIView):
    """List ware by global search"""
    serializer_class = serializers.BaseWareSerializer
    authentication_classes = (JWTAuthentication,)
    pagination_class = StandardResultsSetPagination
    queryset = models.Ware.objects.all()
    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter
    ]
    ordering_fields = ['rate', 'specialoffer__off', 'created_on']

    def get_queryset(self):
        """Return objects"""
        queryset = self.queryset.all()
        # get query params
        search = self.request.query_params.get('search')
        brand = self.request.query_params.get('brand')
        ordering = self.request.query_params.get('ordering')
        if search:
            queryset = queryset.filter(
                Q(sub_sub_category__name__icontains=search) |
                Q(brand__fa_name__icontains=search) |
                Q(brand__en_name__icontains=search) |
                Q(id__icontains=search) |
                Q(name__icontains=search) |
                Q(en_name__icontains=search) |
                Q(sub_sub_category__sub_category__name__icontains=search) |
                Q(sub_sub_category__sub_category__category__name__icontains=search)
            )

        # filter by brand
        if brand:
            brand = brand.split(',')
            queryset = queryset.filter(brand_id__in=brand)

        pk_list = []
        # ordering by view, price and sale count
        if ordering:
            if ordering == 'view':
                temp = sorted(queryset, key=operator.attrgetter('view'), reverse=False)
                for t in temp:
                    pk_list.append(t.id)
            elif ordering == '-view':
                temp = sorted(queryset, key=operator.attrgetter('view'), reverse=True)
                for t in temp:
                    pk_list.append(t.id)
            if ordering == 'sale_count':
                temp = sorted(queryset, key=operator.attrgetter('sale_count'), reverse=False)
                for t in temp:
                    pk_list.append(t.id)
            elif ordering == '-sale_count':
                temp = sorted(queryset, key=operator.attrgetter('sale_count'), reverse=True)
                for t in temp:
                    pk_list.append(t.id)
            if ordering == 'price':
                temp = sorted(queryset, key=operator.attrgetter('price'), reverse=False)
                for t in temp:
                    pk_list.append(t.id)
            elif ordering == '-price':
                temp = sorted(queryset, key=operator.attrgetter('price'), reverse=True)
                for t in temp:
                    pk_list.append(t.id)

        if len(pk_list) > 0:
            preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(pk_list)])
            queryset = models.Ware.objects.filter(pk__in=pk_list).order_by(preserved)

        return queryset


class WareRetrieveBySubSubCategoryApiView(generics.ListAPIView):
    """Retrieve sub sub category with all ware"""

    serializer_class = serializers.BaseWareSerializer
    authentication_classes = (JWTAuthentication,)
    pagination_class = StandardResultsSetPagination
    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter
    ]
    ordering_fields = ['rate', 'off']
    search_fields = ('name', 'brand__name')
    # ordering = ['view']
    queryset = models.Ware.objects.all()

    def get_queryset(self):
        """Return objects"""

        # get query params
        brand = self.request.query_params.get('brand')
        ordering = self.request.query_params.get('ordering')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')

        # get queryset
        queryset = self.queryset.filter(sub_sub_category_id=self.kwargs['pk'])

        # filter by brand
        if brand:
            brand = brand.split(',')
            queryset = queryset.filter(brand_id__in=brand)

        # filter price range
        if not min_price:
            min_price = 0
        if not max_price:
            max_price = math.inf
        for qs in queryset:
            if float(max_price) < qs.price or qs.price < float(min_price):
                queryset = queryset.exclude(id=qs.id)

        # ordering by price or sale
        pk_list = []
        if ordering:
            if ordering == 'price':
                temp = sorted(queryset, key=operator.attrgetter('price'), reverse=False)
                for t in temp:
                    pk_list.append(t.id)
            elif ordering == '-price':
                temp = sorted(queryset, key=operator.attrgetter('price'), reverse=True)
                for t in temp:
                    pk_list.append(t.id)
            if ordering == 'sale_count':
                temp = sorted(queryset, key=operator.attrgetter('sale_count'), reverse=False)
                for t in temp:
                    pk_list.append(t.id)
            elif ordering == '-sale_count':
                temp = sorted(queryset, key=operator.attrgetter('sale_count'), reverse=True)
                for t in temp:
                    pk_list.append(t.id)
            if ordering == 'view':
                temp = sorted(queryset, key=operator.attrgetter('view'), reverse=False)
                for t in temp:
                    pk_list.append(t.id)
            elif ordering == '-view':
                temp = sorted(queryset, key=operator.attrgetter('view'), reverse=True)

        if len(pk_list) > 0:
            preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(pk_list)])
            queryset = models.Ware.objects.filter(pk__in=pk_list).order_by(preserved)
            # clauses = ' '.join(['WHEN id=%s THEN %s' % (pk, i) for i, pk in enumerate(pk_list)])
            # ordering = 'CASE %s END' % clauses
            # queryset = models.Ware.objects.filter(pk__in=pk_list).extra(
            #     select={'ordering': ordering}, order_by=('ordering',))

        return queryset


class WareRetrieveByTagApiView(generics.ListAPIView):
    """Retrieve tag with all ware"""

    serializer_class = serializers.BaseWareSerializer
    authentication_classes = (JWTAuthentication,)
    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter
    ]
    ordering_fields = ['rate', 'off']
    search_fields = ('name', 'brand__name')
    # ordering = ['view']
    queryset = models.Ware.objects.all()

    def get_queryset(self):
        """Return objects"""

        # get query params
        brand = self.request.query_params.get('brand')
        ordering = self.request.query_params.get('ordering')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')

        # get queryset
        queryset = self.queryset.filter(tags__slug__in=[self.kwargs['slug']])

        # filter by brand
        if brand:
            brand = brand.split(',')
            queryset = queryset.filter(brand_id__in=brand)

        # filter price range
        if not min_price:
            min_price = 0
        if not max_price:
            max_price = math.inf
        for qs in queryset:
            if float(max_price) < qs.price or qs.price < float(min_price):
                queryset = queryset.exclude(id=qs.id)

        # ordering by price or sale
        pk_list = []
        if ordering:
            if ordering == 'price':
                temp = sorted(queryset, key=operator.attrgetter('price'), reverse=False)
                for t in temp:
                    pk_list.append(t.id)
            elif ordering == '-price':
                temp = sorted(queryset, key=operator.attrgetter('price'), reverse=True)
                for t in temp:
                    pk_list.append(t.id)
            if ordering == 'sale_count':
                temp = sorted(queryset, key=operator.attrgetter('sale_count'), reverse=False)
                for t in temp:
                    pk_list.append(t.id)
            elif ordering == '-sale_count':
                temp = sorted(queryset, key=operator.attrgetter('sale_count'), reverse=True)
                for t in temp:
                    pk_list.append(t.id)
            if ordering == 'view':
                temp = sorted(queryset, key=operator.attrgetter('view'), reverse=False)
                for t in temp:
                    pk_list.append(t.id)
            elif ordering == '-view':
                temp = sorted(queryset, key=operator.attrgetter('view'), reverse=True)

        if len(pk_list) > 0:
            preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(pk_list)])
            queryset = models.Ware.objects.filter(pk__in=pk_list).order_by(preserved)
            # clauses = ' '.join(['WHEN id=%s THEN %s' % (pk, i) for i, pk in enumerate(pk_list)])
            # ordering = 'CASE %s END' % clauses
            # queryset = models.Ware.objects.filter(pk__in=pk_list).extra(
            #     select={'ordering': ordering}, order_by=('ordering',))

        return queryset


class WareRetrieveBySubCategoryApiView(generics.ListAPIView):
    """Retrieve sub category with all ware"""

    serializer_class = serializers.BaseWareSerializer
    authentication_classes = (JWTAuthentication,)
    pagination_class = StandardResultsSetPagination
    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter
    ]
    ordering_fields = ['rate', 'off']
    search_fields = ('name', 'brand__name')
    # ordering = ['view']
    queryset = models.Ware.objects.all()

    def get_queryset(self):
        """Return objects"""

        # get query params
        brand = self.request.query_params.get('brand')
        ordering = self.request.query_params.get('ordering')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')

        # get queryset
        queryset = self.queryset.filter(sub_sub_category__sub_category_id=self.kwargs['pk'])

        # filter by brand
        if brand:
            brand = brand.split(',')
            queryset = queryset.filter(brand_id__in=brand)

        # filter price range
        if not min_price:
            min_price = 0
        if not max_price:
            max_price = math.inf
        for qs in queryset:
            if float(max_price) < qs.price or qs.price < float(min_price):
                queryset = queryset.exclude(id=qs.id)

        # ordering by price or sale
        pk_list = []
        if ordering:
            if ordering == 'price':
                temp = sorted(queryset, key=operator.attrgetter('price'), reverse=False)
                for t in temp:
                    pk_list.append(t.id)
            elif ordering == '-price':
                temp = sorted(queryset, key=operator.attrgetter('price'), reverse=True)
                for t in temp:
                    pk_list.append(t.id)
            if ordering == 'sale_count':
                temp = sorted(queryset, key=operator.attrgetter('sale_count'), reverse=False)
                for t in temp:
                    pk_list.append(t.id)
            elif ordering == '-sale_count':
                temp = sorted(queryset, key=operator.attrgetter('sale_count'), reverse=True)
                for t in temp:
                    pk_list.append(t.id)
            if ordering == 'view':
                temp = sorted(queryset, key=operator.attrgetter('view'), reverse=False)
                for t in temp:
                    pk_list.append(t.id)
            elif ordering == '-view':
                temp = sorted(queryset, key=operator.attrgetter('view'), reverse=True)

        if len(pk_list) > 0:
            preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(pk_list)])
            queryset = models.Ware.objects.filter(pk__in=pk_list).order_by(preserved)
            # clauses = ' '.join(['WHEN id=%s THEN %s' % (pk, i) for i, pk in enumerate(pk_list)])
            # ordering = 'CASE %s END' % clauses
            # queryset = models.Ware.objects.filter(pk__in=pk_list).extra(
            #     select={'ordering': ordering}, order_by=('ordering',))

        return queryset


class SubCategoryRetrieveApiView(generics.RetrieveAPIView):
    """Retrieve sub category"""

    serializer_class = serializers.SubCategorySerializer
    authentication_classes = (JWTAuthentication,)
    queryset = models.SubCategory.objects.all()


class SubSubCategoryRetrieveApiView(generics.RetrieveAPIView):
    """Retrieve sub sub category"""

    serializer_class = serializers.SubSubCategorySerializer
    authentication_classes = (JWTAuthentication,)
    queryset = models.SubSubCategory.objects.all()


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


class WareRetrieveApiView(generics.RetrieveAPIView):
    """Retrieve ware"""

    serializer_class = serializers.WareDetailSerializer
    authentication_classes = (JWTAuthentication,)
    queryset = models.Ware.objects.all()

    def get_queryset(self):
        models.UserView.objects.filter(date__lt=datetime.date.today()).delete()
        customer_ip = get_client_ip(self.request)
        try:
            models.UserView.objects.get(
                ip=customer_ip,
                ware_id=self.kwargs['pk']
            )
        except models.UserView.DoesNotExist:
            try:
                current_ware = models.Ware.objects.get(id=self.kwargs['pk'])
                current_ware.view = current_ware.view + 1
                current_ware.save()
                models.UserView.objects.create(
                    ip=customer_ip,
                    ware_id=self.kwargs['pk'],
                    date=datetime.date.today()
                )
            except models.Ware.DoesNotExist:
                pass
        return self.queryset


class SubSubCategoryBrandsRetrieveAPIView(generics.RetrieveAPIView):
    """Sub sub category brands API endpoint"""

    serializer_class = serializers.SubSubCategoryBrandSerializer
    authentication_classes = (JWTAuthentication,)
    pagination_class = StandardResultsSetPagination
    queryset = models.SubSubCategory.objects.all()


class WareCommentListCreateAPIView(generics.ListCreateAPIView):
    """Ware comment API endpoint"""

    serializer_class = serializers.WareCommentSerializer
    authentication_classes = (JWTAuthentication,)
    pagination_class = StandardResultsSetPagination
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = models.CommentWare.objects.all()
    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter
    ]
    filterset_fields = ['ware']
    ordering_fields = ['created_on', 'star']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserCartViewSet(viewsets.GenericViewSet,
                      mixins.ListModelMixin,
                      mixins.CreateModelMixin,
                      mixins.UpdateModelMixin,
                      mixins.DestroyModelMixin
                      ):
    serializer_class = serializers.ProductOrderListSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = (
        IsAuthenticated,
        permissions.IsOwner,
    )
    queryset = models.ProductOrder.objects.all()

    def get_queryset(self):
        queryset = models.ProductOrder.objects.filter(user=self.request.user, ordered=False)
        return queryset

    def create(self, request, *args, **kwargs):
        data = request.data
        same_product = models.ProductOrder.objects.filter(
            user=request.user,
            ordered=False
        ).values_list('product_id', flat=True)
        product = data['product']
        if product in same_product:
            return Response(
                {
                    'message': 'You have already added this product'
                },
                status=status.HTTP_200_OK
            )
        return super(UserCartViewSet, self).create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'list':
            return self.serializer_class
        else:
            return serializers.ProductOrderSerializer


class SaleViewSet(viewsets.ModelViewSet):
    """Model view set for sale"""

    serializer_class = serializers.SaleSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = (
        IsAuthenticated,
        permissions.IsOwner,
        permissions.IsAddressOwner,
        # permissions.IsCart,
        # permissions.IsValidCart
        # permissions.IsProcessingSale
    )
    queryset = models.Sale.objects.all()

    def get_queryset(self):
        """Return object"""
        return self.queryset.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        product_ordered_id = self.request.POST.getlist('ware')
        products = models.ProductOrder.objects.filter(id__in=product_ordered_id)
        print(product_ordered_id, products)
        sale_price = 0
        for product in products:
            sale_price += product.price
        while True:
            tracking_code = 'KN-' + str(randint(10000000, 99999999))
            try:
                serializer.save(user=self.request.user, price=sale_price, tracking_code=tracking_code)
                break
            except IntegrityError:
                continue


class ForgetPasswordAPIView(generics.CreateAPIView):
    serializer_class = serializers.UserForgetSerializer
    queryset = models.User.objects.all()

    def create(self, request, *args, **kwargs):
        phone_number = self.request.POST.get('phone_number')
        print("phone: ", phone_number)
        alphabet = string.ascii_letters + string.digits
        password = ''.join(secrets.choice(alphabet) for i in range(8))
        try:
            user = get_user_model().objects.get(phone_number=phone_number)
        except get_user_model().DoesNotExist:
            return Response(
                {
                    'message': 'شماره مورد نظر یافت نشد',
                },
                status=status.HTTP_404_NOT_FOUND
            )
        try:
            api = KavenegarAPI(KAVENEGAR_APIKEY)
            params = {'sender': '1000596446', 'receptor': phone_number,
                      'message': 'کالا نگار\n' + 'رمزعبور جدید شما:' + password}
            api.sms_send(params)
            user.set_password(password)
            user.save()
            return Response(
                {
                    'message': 'رمز عبور به شماره موبایل وارد شده ارسال گردید',
                },
                status=status.HTTP_200_OK
            )
        except APIException:
            return Response(
                {
                    'error': 'ارسال رمز عبور با مشکل مواجه شده است',
                    'type': 'APIException'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        except HTTPException:
            return Response(
                {
                    'error': 'ارسال رمز عبور با مشکل مواجه شده است',
                    'type': 'HTTPException'
                },
                status=status.HTTP_400_BAD_REQUEST
            )


class ReportAPIView(generics.CreateAPIView):
    serializer_class = serializers.ReportSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = (
        IsAuthenticated,
    )
    queryset = models.Report.objects.all()

    def perform_create(self, serializer):
        sale_tracking_code = self.request.POST.get('sale_tracking_code')
        complete_tracking_code = 'KN-' + str(sale_tracking_code)
        try:
            models.Sale.objects.get(user=self.request.user, tracking_code=complete_tracking_code)
        except models.Sale.DoesNotExist:
            raise NotFound("شما سفارشی با این شماره ندارید.")

        serializer.save(user=self.request.user)


class DeleteCart(APIView):
    def delete(self, request):
        models.ProductOrder.objects.filter(user=request.user, ordered=False).delete()
        return Response(
            {
                'message': 'سبد شما حذف گردید'
            },
            status=status.HTTP_200_OK
        )
