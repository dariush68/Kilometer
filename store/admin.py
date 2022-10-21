from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as UserAdminBase
from django.utils.translation import gettext as _

from . import models


class UserAdmin(UserAdminBase):
    ordering = ['id']
    list_display = ['phone_number', 'name']
    fieldsets = (
        (None, {'fields': ('phone_number', 'password')}),
        (
            _('Personal Info'),
            {
                'fields': (
                    'name',
                    'email',
                    'national_code',
                    'is_foreign_people',
                    'bank_card_number',
                    'generated_token',
                    'is_verified',
                )
            }
        ),
        (
            _('Permissions'),
            {
                'fields': ('is_active', 'is_staff', 'is_superuser', 'groups')
            }
        ),
        (
            _('Important dates'),
            {
                'fields': ('last_login',)
            }
        )
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('phone_number', 'password1', 'password2')
        }),
    )


class WareAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('id',)


admin.site.register(models.User, UserAdmin)
admin.site.register(models.UserAddress)
admin.site.register(models.Sale)
admin.site.register(models.Brand)
admin.site.register(models.Color)
admin.site.register(models.Dollar)
admin.site.register(models.Product)
admin.site.register(models.ProductOrder)
admin.site.register(models.Category)
admin.site.register(models.CommentWare)
admin.site.register(models.PictureWare)
admin.site.register(models.Price)
admin.site.register(models.SpecialOffer)
admin.site.register(models.InstantOffer)
admin.site.register(models.Report)
admin.site.register(models.SubCategory)
admin.site.register(models.SubSubCategory)
admin.site.register(models.ReturnedWare)
admin.site.register(models.UserView)
admin.site.register(models.FavoriteWare)
admin.site.register(models.Tag)
admin.site.register(models.SlideShow)
admin.site.register(models.FeatureHeader)
admin.site.register(models.FeatureName)
admin.site.register(models.Feature)
admin.site.register(models.Ware, WareAdmin)
