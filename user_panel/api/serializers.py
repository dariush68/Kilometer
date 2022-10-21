import re
from random import randint

from django.contrib.auth import authenticate
from django.http import JsonResponse
from rest_framework import serializers, exceptions
from django.db.models import Q
import json
from django.core.serializers.json import DjangoJSONEncoder

from store import models
from store.models import User, UserAddress, Sale, ReturnedWare, FavoriteWare, ProductOrder, Product


class AddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserAddress
        fields = ['id', 'user', 'province', 'city', 'address', 'postal_code']
        read_only_fields = ('id', 'user')


class UserUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'email', 'phone_number', 'name',
                  'is_verified', 'is_foreign_people',
                  'national_code', 'bank_card_number']
        read_only_fields = ('id',)


        # extra_kwargs = {
        #     'password': {'write_only': True}
        # }

    # def create(self, validated_data):
    #     username = self.validated_data['username']
    #     if self.validated_data['email'] is True:
    #         email = self.validated_data['email']
    #     else:
        #     email = ""
        # if self.validated_data['first_name'] is True:
        #     first_name = self.validated_data['first_name']
        # else:
        #     first_name = ""
        # if self.validated_data['last_name']:
        #     last_name = self.validated_data['last_name']
        # else:
        #     last_name = ""
        # if self.validated_data['is_verified']:
        #     is_verified = self.validated_data['is_verified']
        # else:
        #     is_verified = False
        # if self.validated_data['is_foreign_people']:
        #     is_foreign_people = self.validated_data['is_foreign_people']
        # else:
        #     is_foreign_people = False
        # if self.validated_data['national_code']:
        #     national_code = self.validated_data['national_code']
        # else:
        #     national_code = ""
        # if self.validated_data['bank_card_number']:
        #     bank_card_number = self.validated_data['bank_card_number']
        # else:
        #     bank_card_number = ""
        # user = User(
        #     username=username,
        #     phone_number=username,
        #     email=email,
        #     first_name=first_name,
        #     last_name=last_name,
        #     national_code=national_code,
        #     is_verified=is_verified,
        #     is_foreign_people=is_foreign_people,
        #     bank_card_number=bank_card_number
        # )
        # password = self.validated_data['password']
        # user.set_password(password)
        # user.save()
        # return user


class UserSignUpSerializer(serializers.ModelSerializer):

    password = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['phone_number', 'password', 'generated_token']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        phone_number = self.validated_data['phone_number']
        generated_token = self.validated_data['generated_token']
        user = User(
            phone_number=phone_number,
            generated_token=generated_token,
        )
        password = self.validated_data['password']
        user.set_password(password)
        user.save()
        return user


class UserPhoneRegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('phone_number', 'generated_token')


# class FavoriteWareSerializer(serializers.ModelSerializer):
#     """Serialize favorite ware model"""
#
#     class Meta:
#         model = FavoriteWare
#         fields = '__all__'
#         read_only_fields = ('id', 'user', 'ware')


# class UserLoginSerializer(serializers.ModelSerializer):
#
#     password = serializers.CharField(style={'input_type': 'password'}, write_only=True)
#
#     class Meta:
#         model = User
#         fields = ['username', 'password']
#
#         extra_kwargs = {
#             'password': {'write_only': True}
#         }
#
#     def validate(self, data):
#         username = data["username"]
#         password = data["password"]
#         if username and password:
#             user = authenticate(username=username,  password=password)
#             if user:
#                 data["user"] = user
#             else:
#                 msg = "Unable to login with given credentials"
#                 raise exceptions.ValidationError(msg)
#         else:
#             msg = "username and password are needed"
#             raise exceptions.ValidationError(msg)
#
#         return data


class ReturnedWareSerializer(serializers.ModelSerializer):
    """Serialize returned ware model"""

    class Meta:
        model = ReturnedWare
        fields = (
            'id',
            'sale',
            'created_on',
            'ware'
        )
        read_only_fields = ('id', 'created_on')


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change"""

    model = User

    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


class BaseWareSerializer(serializers.ModelSerializer):
    """Serialize base ware model"""

    price = serializers.IntegerField(read_only=True)
    sale = serializers.IntegerField(read_only=True)
    off = serializers.IntegerField(read_only=True)

    class Meta:
        model = models.Ware
        fields = (
            'id',
            'name',
            'slug',
            'brand',
            'sale',
            'thumbnail',
            'price',
            'off'
        )
        read_only_fields = ('id',)


class BaseFavoriteWareSerializer(serializers.ModelSerializer):
    """Serialize favorite ware"""

    class Meta:
        model = FavoriteWare
        fields = '__all__'
        read_only_fields = ('id', 'user')


class FavoriteWareSerializer(serializers.ModelSerializer):
    """Serialize Show favorite ware"""
    user = UserUpdateSerializer(many=False)
    ware = BaseWareSerializer(many=False)

    class Meta:
        model = FavoriteWare
        fields = '__all__'
        read_only_fields = ('id', 'user')


class ProductSerializer(serializers.ModelSerializer):
    ware = BaseWareSerializer(many=False)
    class Meta:
        model = Product
        fields = '__all__'


class ProductOrderSerializer(serializers.ModelSerializer):
    product = ProductSerializer(many=False)
    class Meta:
        model = ProductOrder
        fields = '__all__'


class SaleSerializer(serializers.ModelSerializer):
    ware = ProductOrderSerializer(many=True)
    class Meta:
        model = Sale
        fields = '__all__'
        read_only_fields = ('id', 'user', 'ware', 'price', 'tracking_code')


class UseLessSerializer(serializers.Serializer):
    pass
