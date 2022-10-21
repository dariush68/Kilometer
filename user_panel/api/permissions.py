from datetime import datetime

from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import permissions
from store.models import ReturnedWare, Sale, SubCategory, Ware


class IsOwner(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)


class IsTimeValid(permissions.BasePermission):
    message = 'The time is over for returning product'

    def has_permission(self, request, view):
        if request.POST:
            sale_id = request.POST.get('sale')
            wares_id = request.POST.getlist('ware')
            current_sale = get_object_or_404(Sale, id=sale_id)
            now = timezone.now()
            created_date = current_sale.created_on

            for wid in wares_id:
                ware = get_object_or_404(Ware, id=wid)

                ware_duration = SubCategory.objects.get(
                    id=ware.sub_category_id
                ).returned_time

                test_time = timezone.timedelta(
                    hours=ware_duration
                ) + created_date

                if now > test_time:
                    return False

            return True
        return True


class IsProductInSale(permissions.BasePermission):
    message = 'The product you want to return is not in sale'

    def has_permission(self, request, view):
        if request.POST:
            sale_id = request.POST.get('sale')
            wares_id = request.POST.getlist('ware')
            current_sale = get_object_or_404(Sale, id=sale_id)
            ware_exists = current_sale.ware.all().values_list('id', flat=True)
            for wid in wares_id:
                if int(wid) not in ware_exists:
                    return False
            return True
        return True


class IsProductReturnedBefore(permissions.BasePermission):
    message = 'Yoy request more than once for this product'

    def has_permission(self, request, view):
        if request.POST:
            sale_id = request.POST.get('sale')
            wares_id = request.POST.getlist('ware')
            for wid in wares_id:
                if ReturnedWare.objects.filter(sale_id=sale_id, ware=wid).exists():
                    return False
            return True
        return True


