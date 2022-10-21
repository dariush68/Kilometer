from rest_framework import permissions
from store import models


class IsOwnerOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.user == request.user


class IsOwner(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Instance must have an attribute named `owner`.
        return obj.user == request.user


class IsAddressOwner(permissions.BasePermission):
    message = 'You can only use your address'

    def has_permission(self, request, view):

        if request.POST:
            cua = request.POST.get('user_address')
            user_addresses = models.UserAddress.objects.filter(
                user=request.user
            ).values_list('id', flat=True)
            for ua in user_addresses:
                if ua == int(cua):
                    return True
            return False
        return True


class IsProcessingSale(permissions.BasePermission):
    message = 'You can not delete this sale'

    def has_object_permission(self, request, view, obj):

        if request.method == 'DELETE':
            return obj.status == 'processing'

        return True


# class IsValidCart(permissions.BasePermission):
#     message = 'You have a cart!!!'
#
#     def has_permission(self, request, view):
#
#         if request.method == 'POST':
#             return not models.Sale.objects.filter(
#                 user=request.user,
#                 status='cart'
#             ).exists()
#         return True


# class IsCart(permissions.BasePermission):
#     message = 'You can not delete this sale'
#
#     def has_object_permission(self, request, view, obj):
#
#         if request.method == 'DELETE':
#             return obj.status == 'cart'
#         return True
