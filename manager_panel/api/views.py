from django.utils.text import slugify
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets, generics, mixins
from . import permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from . import serializers
from store import models
from django.contrib.auth import get_user_model


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class ManagerInfoView(generics.RetrieveUpdateAPIView):
    """Show detailed of manager user"""
    serializer_class = serializers.UserSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = (permissions.IsManager,)
    queryset = get_user_model().objects.all()

    def get_object(self):
        """Retrieve anr return authenticated user"""
        return self.request.user


class ManagerUserViewSet(viewsets.GenericViewSet,
                         mixins.ListModelMixin,
                         mixins.RetrieveModelMixin):
    """user for manager"""

    serializer_class = serializers.UserSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = (permissions.IsManager,)
    pagination_class = StandardResultsSetPagination
    queryset = get_user_model().objects.all()

    def get_queryset(self):
        """Filter user that doesn't show admin or staff"""
        return self.queryset.filter(
            is_superuser=False, is_staff=False
        ).exclude(groups__name='Manager')


class ManagerSlideShowViewSet(viewsets.ModelViewSet):
    """Manage slideshow in database"""

    serializer_class = serializers.SlideShowSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = (permissions.IsManager,)
    pagination_class = StandardResultsSetPagination
    queryset = models.SlideShow.objects.all()


class ManagerInstantOfferViewSet(viewsets.ModelViewSet):
    """Manage instant offers in database"""

    serializer_class = serializers.SlideShowSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = (permissions.IsManager,)
    pagination_class = StandardResultsSetPagination
    queryset = models.InstantOffer.objects.all()


class ManagerCategoryViewSet(viewsets.ModelViewSet):
    """Manage categories in database"""

    serializer_class = serializers.CategorySerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = (permissions.IsManager,)
    pagination_class = StandardResultsSetPagination
    queryset = models.Category.objects.all()


class ManagerSubCategoryViewSet(viewsets.ModelViewSet):
    """Manage sub category in database"""

    serializer_class = serializers.SubCategorySerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = (permissions.IsManager,)
    pagination_class = StandardResultsSetPagination
    queryset = models.SubCategory.objects.all()


class ManagerSubSubCategoryViewSet(viewsets.ModelViewSet):
    """Manage sub sub category in database"""

    serializer_class = serializers.SubSubCategorySerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = (permissions.IsManager,)
    pagination_class = StandardResultsSetPagination
    queryset = models.SubSubCategory.objects.all()


class ManagerBrandViewSet(viewsets.ModelViewSet):
    """Manage brand in database"""

    serializer_class = serializers.BrandSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = (permissions.IsManager,)
    pagination_class = StandardResultsSetPagination
    queryset = models.Brand.objects.all()

    def perform_create(self, serializer):
        serializer.save(slug=slugify(serializer.validated_data['en_name'], allow_unicode=True))

    def perform_update(self, serializer):
        serializer.save(slug=slugify(serializer.validated_data['en_name'], allow_unicode=True))


class ManagerWareViewSet(viewsets.ModelViewSet):
    """Manage ware in database"""

    serializer_class = serializers.WareSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = (permissions.IsManager,)
    pagination_class = StandardResultsSetPagination
    queryset = models.Ware.objects.all()
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter
    ]
    search_fields = ('name',)

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return serializers.WareDetailSerializer
        else:
            return self.serializer_class

    def get_queryset(self):

        # get query params
        brand = self.request.query_params.get('brand')
        sub_category = self.request.query_params.get('sub_category')

        # get queryset
        queryset = self.queryset

        # filter by brand
        if brand:
            brand = brand.split(',')
            queryset = queryset.filter(brand_id__in=brand)

        if sub_category:
            sub_category = sub_category.split(',')
            queryset = queryset.filter(sub_category_id__in=sub_category)

        return queryset

    def perform_create(self, serializer):
        serializer.save(slug=slugify(serializer.validated_data['name'], allow_unicode=True))

    def perform_update(self, serializer):
        serializer.save(slug=slugify(serializer.validated_data['name'], allow_unicode=True))


class ManagerProductViewSet(viewsets.ModelViewSet):
    """Manage ware in database"""

    serializer_class = serializers.ProductSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = (permissions.IsManager,)
    pagination_class = StandardResultsSetPagination
    queryset = models.Product.objects.all()
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter
    ]
    filterset_fields = ['ware__sub_category', 'ware__brand', 'color']
    search_fields = ('ware__name',)

    def perform_create(self, serializer):
        models.Price.objects.create(
            user=self.request.user,
            ware=serializer.validated_data['ware'],
            price=serializer.validated_data['price']
        )
        serializer.save()

    def perform_update(self, serializer):
        if serializer.validated_data['price']:
            print(self.get_object().ware.id)
            last_price = models.Price.objects.filter(ware_id=self.get_object().ware.id).order_by('-created_on')[0]
            if last_price.price != serializer.validated_data['price']:
                models.Price.objects.create(
                    user=self.request.user,
                    ware_id=self.get_object().ware.id,
                    price=serializer.validated_data['price']
                )
        serializer.save()

    def perform_destroy(self, instance):
        products = models.Product.objects.filter(ware=instance.ware).exclude(id=instance.id)
        print(products)
        try:
            temp = models.Product.objects.get(id=products[0].id)
            temp.default = True
            temp.save()
        except IndexError:
            pass
        instance.delete()

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return serializers.ShowProductSerializer
        else:
            return self.serializer_class


class ManagerColorViewSet(viewsets.ModelViewSet):
    """Manage ware in database"""

    serializer_class = serializers.ColorSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = (permissions.IsManager,)
    pagination_class = StandardResultsSetPagination
    queryset = models.Color.objects.all()


class ManagerWarePictureViewSet(viewsets.ModelViewSet):
    """Manage ware picture in database"""

    serializer_class = serializers.WarePictureSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = (permissions.IsManager,)
    pagination_class = StandardResultsSetPagination
    queryset = models.PictureWare.objects.all()


class ManagerPriceViewSet(viewsets.GenericViewSet,
                          mixins.ListModelMixin,
                          mixins.RetrieveModelMixin):
    """Manage price in database"""

    serializer_class = serializers.PriceSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = (permissions.IsManager,)
    pagination_class = StandardResultsSetPagination
    queryset = models.Price.objects.all()

    def perform_create(self, serializer):
        """Create a new object"""
        serializer.save(user=self.request.user)


class ManagerSpecialOfferViewSet(viewsets.ModelViewSet):
    """Manage special offer in database"""

    serializer_class = serializers.SpecialOfferSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = (permissions.IsManager,)
    pagination_class = StandardResultsSetPagination
    queryset = models.SpecialOffer.objects.all()


class ManagerSaleViewSet(viewsets.GenericViewSet,
                         mixins.ListModelMixin,
                         mixins.RetrieveModelMixin):
    """Manage sale in database"""

    serializer_class = serializers.SaleSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = (permissions.IsManager,)
    pagination_class = StandardResultsSetPagination
    queryset = models.Sale.objects.all()
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter
    ]
    filterset_fields = ['status']
    search_fields = ('ware__name',)

    def get_serializer_class(self):
        if self.action == 'list':
            return self.serializer_class
        else:
            return serializers.SaleDetailSerializer


class ManagerReportViewSet(viewsets.GenericViewSet,
                           mixins.ListModelMixin,
                           mixins.RetrieveModelMixin):
    """Manage user reports in database"""

    serializer_class = serializers.ReportSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = (permissions.IsManager,)
    pagination_class = StandardResultsSetPagination
    queryset = models.Report.objects.all()
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter
    ]
    filterset_fields = ['subject']
    ordering_fields = ['created_on']
    search_fields = ('user',)


class ManagerTagViewSet(viewsets.ModelViewSet):
    """Manage ware in database"""

    serializer_class = serializers.TagSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = (permissions.IsManager,)
    pagination_class = StandardResultsSetPagination
    queryset = models.Tag.objects.all()
    filter_backends = [
        filters.SearchFilter
    ]
    search_fields = ('en_name', 'fa_name')

    def perform_create(self, serializer):
        serializer.save(slug=slugify(serializer.validated_data['en_name'], allow_unicode=True))

    def perform_update(self, serializer):
        serializer.save(slug=slugify(serializer.validated_data['en_name'], allow_unicode=True))
