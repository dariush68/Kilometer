from random import randint

from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.shortcuts import get_object_or_404
from kavenegar import KavenegarAPI, APIException, HTTPException
from rest_framework import status, viewsets, mixins
from rest_framework.generics import (
    DestroyAPIView,
    ListAPIView,
    ListCreateAPIView,
    RetrieveUpdateAPIView,
    UpdateAPIView)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from kilometer.settings import KAVENEGAR_APIKEY
from store.models import User, UserAddress, Sale, ReturnedWare, FavoriteWare
from . import serializers
from .permissions import IsOwner, IsTimeValid, IsProductInSale, IsProductReturnedBefore


class UserInfoView(RetrieveUpdateAPIView):
    """Show detailed of user"""
    serializer_class = serializers.UserUpdateSerializer
    authentication_classes = (JWTAuthentication,)

    def get_object(self):
        """Retrieve and return authenticated user"""
        return self.request.user


# class UserAPIView(APIView):
#     serializer_class = serializers.UserUpdateSerializer
#
#     def get(self, request):
#         user = User.objects.get(id=request.user.id)
#         users = User.objects.all()
#         if user.groups.filter(name="Manager").exists():
#             serializer = serializers.UserUpdateSerializer(users, many=True)
#             return Response(serializer.data)
#         else:
#             serializer = serializers.UserUpdateSerializer(user)
#             return Response(serializer.data)
#
#     def post(self, request):
#         serializer = serializers.UserUpdateSerializer(data=request.data)
#
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#     def put(self, request):
#         user = User.objects.get(id=request.user.id)
#         serializer = serializers.UserUpdateSerializer(user, data=request.data)
#
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"message": "User updated successfully"})
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserAddressViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.AddressSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = UserAddress.objects.all()

    def get_queryset(self):
        queryset = UserAddress.objects.filter(user=self.request.user)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# class UserAddressAPIView(ListCreateAPIView):
#     serializer_class = serializers.AddressSerializer
#     authentication_classes = (JWTAuthentication,)
#     permission_classes = (IsAuthenticated,)
#
#     def get(self, request):
#         user_address = UserAddress.objects.filter(user=request.user)
#         serializer = serializers.AddressSerializer(user_address, many=True)
#         if len(serializer.data) == 0:
#             return Response(
#                 {
#                     'error': 'شما آدرسی ندارید'
#                 },
#                 status=status.HTTP_400_BAD_REQUEST
#             )
#         return Response(serializer.data)
#
#     def post(self, request):
#         user = get_object_or_404(get_user_model(), phone_number=request.user.phone_number)
#         serializer = serializers.AddressSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save(user=user)
#             return Response({"message": "Address added successfully"})
#
#     def put(self, request):
#         serializer = serializers.AddressSerializer(data=request.data)
#         if serializer.is_valid():
#             # address = UserAddress.objects.get(id=serializer.data['id'])
#             return Response(serializer.data)
#         else:
#             return Response(serializer.errors)
#
#
# class UpdateUserAddressView(RetrieveUpdateAPIView):
#     authentication_classes = (JWTAuthentication,)
#     permission_classes = (IsOwner,)
#     serializer_class = serializers.AddressSerializer
#     queryset = UserAddress.objects.all()


class SignUpAPIView(APIView):
    serializer_class = serializers.UserSignUpSerializer

    def post(self, request):
        serializer = serializers.UserSignUpSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data['generated_token'] = randint(100000, 999999)
            try:
                api = KavenegarAPI(KAVENEGAR_APIKEY)
                params = {'sender': '1000596446', 'receptor': serializer.validated_data['phone_number'],
                          'message': 'کالا نگار\n' + 'کد تایید:' + str(serializer.validated_data['generated_token'])}
                response = api.sms_send(params)
                serializer.save()
                return Response({"user": "signed up successfully",
                                 "generated token": serializer.data['generated_token']})

            except APIException:
                return Response(
                    {
                        'error': 'ارسال کد تایید با مشکل مواجه شده است',
                        'type': 'APIException'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            except HTTPException:
                return Response(
                    {
                        'error': 'ارسال کد تایید با مشکل مواجه شده است',
                        'type': 'HTTPException'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserPhoneRegisterAPIView(APIView):

    def put(self, request):
        data = request.data
        user = get_object_or_404(get_user_model(), phone_number=data['phone_number'])
        if user:
            serializer = serializers.UserPhoneRegisterSerializer(user, data=data)
            if serializer.is_valid():
                if serializer.data['generated_token'] == int(data.get("generated_token")):
                    user.is_verified = True
                    user.save()
                    return Response({"user": "verified successfully"})
                else:
                    return Response(
                        {'error': 'The entered token is invalid'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class FavoriteWareListAPIView(ListAPIView):
#     authentication_classes = (JWTAuthentication,)
#     permission_classes = (IsOwner,)
#     serializer_class = serializers.FavoriteWareSerializer
#
#     def get_queryset(self):
#         queryset = FavoriteWare.objects.filter(user=self.request.user)
#         return queryset
#
#
# class FavoriteWareDestroyAPIView(DestroyAPIView):
#     authentication_classes = (JWTAuthentication,)
#     permission_classes = (IsOwner,)
#     serializer_class = serializers.FavoriteWareSerializer
#     queryset = FavoriteWare.objects.all()


class SaleListAPIView(ListAPIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsOwner,)
    serializer_class = serializers.SaleSerializer

    def get_queryset(self):
        queryset = Sale.objects.filter(user=self.request.user, status__in=['processing', 'posted', 'delivered'])
        return queryset


# class LoginAPIView(APIView):
#
#     serializer_class = serializers.UserLoginSerializer
#
#     def post(self, request):
#         serializer = serializers.UserLoginSerializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.validated_data["user"]
#             login(request, user)
#             return Response({"user": "logged in"})
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def is_manager(user):
    return user.groups.filter(name='Manager').exists()


class IsManagerAPIView(APIView):

    def get(self, request):
        user = User.objects.get(phone_number=request.user.phone_number)
        if is_manager(user):
            return Response(
                {
                    'isManager': True,
                },
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {
                    'isManager': False,
                },
                status=status.HTTP_200_OK
            )


class ReturnedWareViewSet(viewsets.GenericViewSet,
                          mixins.ListModelMixin,
                          mixins.RetrieveModelMixin,
                          mixins.CreateModelMixin,
                          mixins.DestroyModelMixin):
    """All method except update"""

    serializer_class = serializers.ReturnedWareSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsTimeValid, IsProductInSale, IsProductReturnedBefore)
    queryset = ReturnedWare.objects.all()


class ChangePasswordView(UpdateAPIView):
    """
    An endpoint for changing password.
    """
    serializer_class = serializers.ChangePasswordSerializer
    model = User
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["رمز عبور فعلی نادرست میباشد!"]}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Password updated successfully',
                'data': []
            }

            return Response(response)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FavoriteWareViewSet(viewsets.ModelViewSet):
    """Favorite ware in user panel"""

    serializer_class = serializers.FavoriteWareSerializer
    permission_classes = (
        IsAuthenticated,
    )
    authentication_classes = (JWTAuthentication,)
    queryset = FavoriteWare.objects.all()

    def get_queryset(self):
        """Return objects for authenticated user"""
        return self.queryset.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        data = request.data
        try:
            FavoriteWare.objects.create(
                user_id=request.user.id,
                ware_id=data['ware']
            )
            return Response(
                {
                    'data': {
                        'user': request.user.id,
                        'ware': int(data['ware'])
                    }
                },
                status=status.HTTP_201_CREATED
            )
        except IntegrityError:
            return Response(
                {
                    'error': {
                        'message': 'این کالا در لیست علاقه مندی شما قرار دارد',
                    }
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return self.serializer_class
        else:
            return serializers.BaseFavoriteWareSerializer


class ResendCodeViewSet(viewsets.GenericViewSet,
                        mixins.CreateModelMixin):
    """Resend code for signup token"""
    serializer_class = serializers.UseLessSerializer
    queryset = get_user_model().objects.all()

    def create(self, request, *args, **kwargs):
        phone_number = request.POST.get('phone_number')
        try:
            user = get_user_model().objects.get(phone_number=phone_number)
        except get_user_model().DoesNotExist:
            return Response(
                {
                    'message': 'شماره مورد نظر یافت نشد',
                },
                status=status.HTTP_404_NOT_FOUND
            )
        generated_token = randint(100000, 999999)
        user.generated_token = generated_token
        user.save()
        try:
            api = KavenegarAPI(KAVENEGAR_APIKEY)
            params = {
                'sender': '1000596446',
                'receptor': phone_number,
                'message': 'کالا نگار\n' + 'کد تایید:' + str(generated_token)
            }
            api.sms_send(params)
            return Response(
                {
                    "message": "کد تایید با موفقیت ارسال شد"
                },
                status=status.HTTP_200_OK
            )

        except APIException:
            return Response(
                {
                    'error': 'ارسال کد تایید با مشکل مواجه شده است',
                    'type': 'APIException'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        except HTTPException:
            return Response(
                {
                    'error': 'ارسال کد تایید با مشکل مواجه شده است',
                    'type': 'HTTPException'
                },
                status=status.HTTP_400_BAD_REQUEST
            )