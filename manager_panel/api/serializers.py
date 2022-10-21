from rest_framework import serializers
from django.contrib.auth import get_user_model
from store import models


class UserSerializer(serializers.ModelSerializer):
    """Serialize user model"""

    class Meta:
        model = get_user_model()
        fields = (
            'id',
            'email',
            'name',
            'phone_number',
            'national_code',
            'is_foreign_people',
            'bank_card_number'
        )
        read_only_fields = ('id',)

        # def update(self, instance, validated_data):
        #     """Update the user, setting the password correctly and return it"""
        #     user = super().update(instance, validated_data)
        #
        #     return user


class SlideShowSerializer(serializers.ModelSerializer):
    """Serialize slide show model"""

    class Meta:
        model = models.SlideShow
        fields = '__all__'
        read_only_fields = ('id',)


class InstantOfferCreateSerializer(serializers.ModelSerializer):
    """Serialize Instant offer model"""

    class Meta:
        model = models.SlideShow
        fields = '__all__'
        read_only_fields = ('id',)


class CategorySerializer(serializers.ModelSerializer):
    """Serialize category model"""

    class Meta:
        model = models.Category
        fields = (
            'id',
            'name',
            'slug',
            'image',
            'image_alt',
            'description'
        )
        read_only_fields = ('id',)


class SubCategorySerializer(serializers.ModelSerializer):
    """Serialize sub category model"""

    class Meta:
        model = models.SubCategory
        fields = (
            'id',
            'category',
            'name',
            'slug',
            'image',
            'image_alt',
            'description'
        )
        read_only_fields = ('id',)


class SubSubCategorySerializer(serializers.ModelSerializer):
    """Serialize sub category model"""

    class Meta:
        model = models.SubSubCategory
        fields = (
            'id',
            'sub_category',
            'name',
            'slug',
            'image',
            'image_alt',
            'description'
        )
        read_only_fields = ('id',)


class BrandSerializer(serializers.ModelSerializer):
    """Serialize brand model"""

    class Meta:
        model = models.Brand
        fields = (
            'id',
            'fa_name',
            'en_name',
            'slug',
            'logo',
            'logo_alt',
            'created_on',
            'description'
        )
        read_only_fields = ('id', 'slug', 'created_on',)


class WarePictureSerializer(serializers.ModelSerializer):
    """Serialize ware picture model"""

    ordering = serializers.CharField()

    def validate_ordering(self, value):
        print(value)
        if not value:
            error = 'You should set ordering for ware pictures'
            return error
        try:
            return int(value)
        except ValueError:
            raise serializers.ValidationError('You must supply an integer for ordering')

    class Meta:
        model = models.PictureWare
        fields = (
            'id',
            'ware',
            'created_on',
            'picture',
            'picture_alt',
            'ordering',
            'description',
        )
        read_only_fields = ('id',)


class ShowProductForWareSerializer(serializers.ModelSerializer):
    """Serialize product model"""

    class Meta:
        model = models.Product
        fields = (
            'id',
            'color',
            'price',
            'stock',
            'default',
        )
        read_only_fields = ('id',)
        depth = 1


class WareSerializer(serializers.ModelSerializer):
    """Serialize ware model"""

    class Meta:
        model = models.Ware
        fields = (
            'id',
            'sub_sub_category',
            'brand',
            'name',
            'en_name',
            'slug',
            'rate',
            'thumbnail',
            'thumbnail_alt',
            'created_on',
            'updated_on',
            'criticism',
            'view',
            'info'
        )
        read_only_fields = ('slug', )


class WareDetailSerializer(serializers.ModelSerializer):
    """Serialize ware model"""
    picture = WarePictureSerializer(many=True)
    product = ShowProductForWareSerializer(many=True)

    class Meta:
        model = models.Ware
        fields = (
            'id',
            'sub_sub_category',
            'brand',
            'name',
            'en_name',
            'slug',
            'picture',
            'picture_alt',
            'product',
            'rate',
            'thumbnail',
            'created_on',
            'updated_on',
            'criticism',
            'view',
            'info'
        )
        read_only_fields = ('id', 'slug')
        depth = 1


class PriceSerializer(serializers.ModelSerializer):
    """Serialize price model"""
    user = UserSerializer(many=False)
    ware = WareSerializer(many=False)

    class Meta:
        model = models.Price
        fields = (
            'id',
            'user',
            'ware',
            'price',
        )
        read_only_fields = ('id', 'user')


class SpecialOfferSerializer(serializers.ModelSerializer):
    """Serialize special offer model"""

    class Meta:
        model = models.SpecialOffer
        fields = (
            'id',
            'ware',
            'off',
            'created_on',
            'duration',
            'description'
        )
        read_only_fields = ('id',)


class UserAddressSerializer(serializers.ModelSerializer):
    """Serialize user address model"""

    class Meta:
        model = models.UserAddress
        fields = '__all__'


class SaleDetailSerializer(serializers.ModelSerializer):
    """Serialize detail sale model"""

    user_address = UserAddressSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    ware = WareSerializer(many=True, read_only=True)

    class Meta:
        model = models.Sale
        fields = (
            'id',
            'tracking_code',
            'ware',
            'user',
            'user_address',
            'price',
            'off',
            'created_on',
            'description',
            'credit_cart',
            'status'
        )

        read_only_fields = ('id', 'created_on', 'user')


class SaleSerializer(serializers.ModelSerializer):
    """Serialize sale model"""

    class Meta:
        model = models.Sale
        fields = (
            'id',
            'tracking_code',
            'ware',
            'user',
            'user_address',
            'price',
            'off',
            'created_on',
            'description',
            'credit_cart',
            'status'
        )

        read_only_fields = ('id', 'created_on', 'user')


class ColorSerializer(serializers.ModelSerializer):
    """Serialize color model"""

    class Meta:
        model = models.Color
        fields = (
            'id',
            'name',
            'hex_code'
        )
        read_only_fields = ('id',)


class ProductSerializer(serializers.ModelSerializer):
    """Serialize product model"""

    class Meta:
        model = models.Product
        fields = (
            'id',
            'ware',
            'color',
            'price',
            'stock',
            'manual',
            'default'
        )
        read_only_fields = ('id',)


class ShowProductSerializer(serializers.ModelSerializer):
    """Serialize product model"""

    class Meta:
        model = models.Product
        fields = (
            'id',
            'ware',
            'color',
            'price',
            'stock',
            'default',
        )
        read_only_fields = ('id',)
        depth = 1


class ReportSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Report
        fields = '__all__'
        read_only_fields = ('id',)


class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Tag
        fields = '__all__'
        read_only_fields = ('id', 'slug')
