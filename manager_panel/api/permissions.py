from rest_framework.permissions import BasePermission
from store.models import Product


class IsManager(BasePermission):
    def has_permission(self, request, view):
        if request.user and request.user.groups.filter(name='Manager'):
            return True
        return False


# class IsOneDefault(BasePermission):
#     def has_permission(self, request, view):
#         if request.POST:
#             valid = True
#             products = Product.objects.filter(ware_id=request.POST.get('ware'))
#             for product in products:
#                 if product.default:
#                     valid = False
#             return valid
#
#     def has_object_permission(self, request, view, obj):
#         if request.PUT:
#             products = Product.objects.filter(ware_id=request.POST.get('ware'))
#             valid = True
#             for product in products:
#                 if product.default:
#                     valid = False
#
