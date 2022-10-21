import operator

from rest_framework import serializers
from django.contrib.auth import get_user_model
from store import models


class UserSerializer(serializers.ModelSerializer):
    """Serialize user model"""

    class Meta:
        model = get_user_model()
        fields = (
            'id',
            'phone_number',
            'name',
            'email'
        )


class SlideShowSerializer(serializers.ModelSerializer):
    """Serialize slide show model"""

    class Meta:
        model = models.SlideShow
        fields = '__all__'


class WareCommentSerializer(serializers.ModelSerializer):
    """Serialize ware comment model"""

    user = UserSerializer(many=False, read_only=True)

    class Meta:
        model = models.CommentWare
        fields = '__all__'
        read_only_fields = ('id', 'user')
        # depth = 1


class WarePictureSerializer(serializers.ModelSerializer):
    """Serialize ware picture model"""

    class Meta:
        model = models.PictureWare
        fields = '__all__'
        read_only_fields = ('id',)


class ProductSerializer(serializers.ModelSerializer):
    toman_price = serializers.IntegerField(read_only=True)

    class Meta:
        model = models.Product
        exclude = ['ware']
        read_only_fields = ('id',)
        depth = 1


class BrandSerializer(serializers.ModelSerializer):
    """Serialize brand model"""
    class Meta:
        model = models.Brand
        fields = ['id', 'fa_name', 'en_name']


class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Tag
        fields = '__all__'
        read_only_fields = ('id',)


class BaseWareSerializer(serializers.ModelSerializer):
    """Serialize base ware model"""

    price = serializers.IntegerField(read_only=True)
    sale_count = serializers.IntegerField(read_only=True)
    off = serializers.IntegerField(read_only=True)
    tags = TagSerializer(many=True)

    class Meta:
        model = models.Ware
        fields = (
            'id',
            'name',
            'en_name',
            'slug',
            'brand',
            'sale_count',
            'thumbnail',
            'thumbnail_alt',
            'price',
            'off',
            'view',
            'tags'
        )
        read_only_fields = ('id',)


class WareDetailSerializer(BaseWareSerializer):
    """Serialize detail ware model"""

    picture = WarePictureSerializer(many=True)
    comment = WareCommentSerializer(many=True)
    similar_product = BaseWareSerializer(many=True)
    product = ProductSerializer(many=True)

    class Meta(BaseWareSerializer.Meta):
        fields = BaseWareSerializer.Meta.fields + (
            (
                'sub_sub_category',
                'product',
                'rate',
                'criticism',
                'info',
                'picture',
                'comment',
                'similar_product'
            )
        )
        depth = 3


class InstantOfferSerializer(serializers.ModelSerializer):
    ware = BaseWareSerializer(many=False)

    class Meta:
        model = models.InstantOffer
        fields = '__all__'


class SubSubCategorySerializer(serializers.ModelSerializer):
    """Serialize sub sub category model"""

    ware = BaseWareSerializer(many=True)
    brands = BrandSerializer(many=True)

    class Meta:
        model = models.SubSubCategory
        fields = (
            'id',
            'sub_category',
            'name',
            'en_name',
            'slug',
            'image',
            'image_alt',
            'description',
            'ware',
            'brands'
        )
        read_only_fields = ('id',)
        depth = 2


class SubSubCategoryBrandSerializer(serializers.ModelSerializer):
    brands = BrandSerializer(many=True)

    class Meta:
        model = models.SubSubCategory
        fields = ['id', 'name', 'brands']


class SubSubCategoryMainPageSerializer(serializers.ModelSerializer):
    """Serialize sub sub category model"""
    ware_set = serializers.SerializerMethodField()

    class Meta:
        model = models.SubSubCategory
        fields = (
            'id',
            'category',
            'name',
            'image',
            'image_alt',
            'description',
            'ware_set',
        )
        read_only_fields = ('id',)
        depth = 1

    def get_ware_set(self, instance):
        wares = instance.ware_set.all()
        wares_sort = sorted(wares, key=operator.attrgetter('view'), reverse=True)[:7]
        return BaseWareSerializer(wares_sort, many=True).data


class SubSubCategoryForSubCategorySerializer(serializers.ModelSerializer):
    """Serialize sub sub category model"""
    brands = BrandSerializer(many=True)
    ware_set = serializers.SerializerMethodField()

    class Meta:
        model = models.SubSubCategory
        fields = (
            'id',
            'name',
            'slug',
            'brands',
            'image',
            'image_alt',
            'ware_set'
        )
        read_only_fields = ('id',)

    def get_ware_set(self, instance):
        wares = instance.ware_set.all()
        print(wares)
        wares_sort = sorted(wares, key=operator.attrgetter('view'), reverse=True)[:7]
        return BaseWareSerializer(wares_sort, many=True).data


class SubCategorySerializer(serializers.ModelSerializer):
    """Serialize sub category model"""

    subsubcategory = SubSubCategoryForSubCategorySerializer(many=True)

    class Meta:
        model = models.SubCategory
        fields = (
            'id',
            'category',
            'name',
            'slug',
            'image',
            'image_alt',
            'description',
            'subsubcategory',
        )
        read_only_fields = ('id',)
        depth = 1


class SubCategoryMainPageSerializer(serializers.ModelSerializer):
    """Serialize sub category model"""

    class Meta:
        model = models.SubCategory
        fields = (
            'id',
            'category',
            'name',
            'image',
            'image_alt',
            'description',
            # 'ware_set',
        )
        read_only_fields = ('id',)
        depth = 1


# class SubCategoryForCategorySerializer(serializers.ModelSerializer):
#     """Serialize sub category model"""
#     brands = BrandSerializer(many=True)
#
#     class Meta:
#         model = models.SubCategory
#         fields = (
#             'id',
#             'name',
#             'brands',
#             'image'
#         )
#         read_only_fields = ('id',)


class SpecialOfferSerializer(serializers.ModelSerializer):
    """Serialize special offer model"""

    class Meta:
        model = models.SpecialOffer
        fields = (
            'id',
            'ware',
            'description',
            'created_on',
            'deleted_on',
            'off'
        )
        read_only_fields = ('id',)
        depth = 1


class UserAddressSerializer(serializers.ModelSerializer):
    """Serialize user address model"""

    class Meta:
        model = models.UserAddress
        fields = '__all__'


class ProductWareSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Ware
        fields = (
            'id',
            'name',
            'en_name',
            'thumbnail',
            'thumbnail_alt'
        )
        read_only_fields = ('id', 'name', 'thumbnail')


class ProductWithWareSerializer(serializers.ModelSerializer):
    ware = ProductWareSerializer()

    class Meta:
        model = models.Product
        fields = (
            'id',
            'ware',
        )
        read_only_fields = ('id', 'ware')


# class ProductOrderListSerializer(serializers.ModelSerializer):
#     price = serializers.IntegerField(read_only=True)
#     product = ProductWithWareSerializer()
#
#     class Meta:
#         model = models.ProductOrder
#         fields = (
#             'id',
#             'user',
#             'product',
#             'quantity',
#             'price',
#             'ordered'
#         )
#         read_only_fields = ('id', )
#

class ProductOrderListSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False)

    class Meta:
        model = models.ProductOrder
        fields = (
            'id',
            'user',
            'product',
            'quantity',
            'ordered'
        )
        read_only_fields = ('id', 'user')
        depth = 2


class ProductOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProductOrder
        fields = (
            'id',
            'user',
            'product',
            'quantity',
            'ordered'
        )
        read_only_fields = ('id', 'user')


class SaleSerializer(serializers.ModelSerializer):
    """Serialize sale model"""
    # user_address = UserAddressSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    # ware = BaseWareSerializer(many=True, read_only=True)

    class Meta:
        model = models.Sale
        fields = (
            'id',
            'tracking_code',
            'ware',
            'user',
            'user_address',
            'price',
            'created_on',
            'description',
            'credit_cart',
            'status'
        )

        read_only_fields = ('id', 'tracking_code', 'created_on', 'price', 'user')


# class SaleChangeSerializer(serializers.ModelSerializer):
#     """Serialize sale model"""
#
#     class Meta:
#         model = models.Sale
#         fields = (
#             'id',
#             'ware',
#             'user',
#             'user_address',
#             'price',
#             'created_on',
#             'description',
#             'credit_cart',
#             'status'
#         )
#
#         read_only_fields = ('id', 'created_on', 'user', 'status', 'price')


class UserForgetSerializer(serializers.Serializer):
    phone_number = serializers.IntegerField()

    class Meta:
        model = models.User


class BaseCategorySerializer(serializers.ModelSerializer):
    """Base serialize category model"""

    class Meta:
        model = models.Category
        fields = (
            'id',
            'name',
            'slug',
            'image',
            'image_alt',
            'description',
            'subcategory',
        )
        read_only_fields = ('id',)


class CategoryListSerializer(BaseCategorySerializer):
    """Serialize list category model"""
    subcategory = SubCategorySerializer(many=True)


# class CategoryRetrieveSerializer(BaseCategorySerializer):
#     """Serialize detail category model"""
#     subcategory = SubCategoryMainPageSerializer(many=True)
#     wares = BaseWareSerializer(many=True)
#
#     class Meta(BaseCategorySerializer.Meta):
#         fields = BaseCategorySerializer.Meta.fields + (
#             (
#                 'wares',
#             )
#         )


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Report
        fields = '__all__'
        read_only_fields = ('id', 'user')

