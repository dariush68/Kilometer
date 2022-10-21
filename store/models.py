from django.db import models
from django.core.validators import RegexValidator, MaxValueValidator, MinValueValidator
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractBaseUser, \
    BaseUserManager, \
    PermissionsMixin
from django.conf import settings
from django.contrib.contenttypes.fields import GenericRelation
from django.db.models import F
from django.template.defaultfilters import slugify

# from extensions.utils import jalali_converter

person_id_checker = RegexValidator(
    regex=r'^[0-9]*$',
    message="یک کد ملی معتبر وارد کنید."
)

credit_cart_checker = RegexValidator(
    regex=r'^[0-9]*$',
    message="یک شماره کارت معتبر وارد کنید."
)

postal_code_checker = RegexValidator(
    regex=r'^[0-9]*$',
    message="یک کدپستی معتبر وارد کنید."
)


def validate_phone_number(value):
    if value and is_number(value) and \
            is_valid_phone_number(value) and \
            len(value) == 11:
        return value
    else:
        raise ValidationError("یک شماره تلفن معتبر وارد کنید.")


def is_number(s):
    try:
        int(s)
        return True
    except ValueError:
        return False


def is_valid_phone_number(number):
    if number[0] == '0' and number[1] == '9':
        return True
    else:
        return False


class UserManager(BaseUserManager):

    def create_user(self, phone_number, password, email=None,
                    **extra_fields):
        """Create and save a new user"""
        if phone_number and \
                is_number(phone_number) and \
                is_valid_phone_number(phone_number) and \
                len(phone_number) == 11:
            pass
        else:
            raise ValueError('Phone number is invalid!')
        if email:
            email = self.normalize_email(email)
        user = self.model(
            phone_number=phone_number,
            email=email,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, phone_number, password):
        """create and save new super user"""
        user = self.create_user(phone_number, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model that support email instead of username"""
    name = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(
        validators=[validate_phone_number],
        max_length=11,
        unique=True,
    )
    email = models.EmailField(
        max_length=255,
        unique=True,
        blank=True,
        null=True,
    )
    national_code = models.CharField(
        validators=[person_id_checker],
        max_length=10,
        blank=True,
        null=True,
    )
    is_foreign_people = models.BooleanField(
        default=False,
    )
    bank_card_number = models.CharField(
        validators=[credit_cart_checker],
        max_length=16,
        blank=True,
    )
    generated_token = models.IntegerField(
        blank=True,
        null=True,
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'phone_number'


class UserAddress(models.Model):
    """Address for user model"""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    province = models.CharField(blank=True, max_length=30)
    city = models.CharField(blank=True, max_length=30)
    address = models.TextField()
    postal_code = models.CharField(
        validators=[postal_code_checker],
        max_length=10
    )

    def __str__(self):
        return f'{self.id}, {self.user}, {self.address}'


class SlideShow(models.Model):
    image = models.ImageField(upload_to='uploads/slide-show/', blank=False, null=False)
    image_alt = models.CharField(max_length=255)
    link = models.URLField(blank=True, null=True)
    is_shown = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.id}, {self.is_shown}'


class Brand(models.Model):
    en_name = models.CharField(max_length=255, unique=True, error_messages={
        'unique': "چنین نامی وجود دارد!",
    })
    fa_name = models.CharField(max_length=255, unique=True, error_messages={
        'unique': "چنین نامی وجود دارد!",
    })
    slug = models.CharField(max_length=255, unique=True, error_messages={
        'unique': "چنین نامی وجود دارد!",
    })
    logo = models.ImageField(null=True, blank=True, upload_to='uploads/brand/')
    logo_alt = models.CharField(max_length=255)
    created_on = models.DateTimeField(auto_now_add=True)
    description = models.TextField(null=True, blank=True)

    # def jalali_created_on(self):
    #     return jalali_converter(self.created_on)

    def __str__(self):
        return self.en_name


class Category(models.Model):
    name = models.CharField(max_length=128)
    slug = models.CharField(max_length=255, blank=False, null=False)
    image = models.ImageField(
        upload_to='uploads/category/',
        null=True,
        blank=True
    )
    image_alt = models.CharField(max_length=255)
    created_on = models.DateTimeField(auto_now_add=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

    @property
    def subcategory(self):
        return self.subcategory_set.all()

    @property
    def wares(self):
        return Ware.objects.filter(sub_sub_category__sub_category__category=self)[:10]


class SubCategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    name = models.CharField(max_length=128)
    slug = models.CharField(max_length=255, blank=False, null=False)
    image = models.ImageField(
        upload_to='uploads/sub-category/',
        null=True,
        blank=True
    )
    image_alt = models.CharField(max_length=255)
    created_on = models.DateTimeField(auto_now_add=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return f'{self.category}, {self.name}'

    @property
    def subsubcategory(self):
        return self.subsubcategory_set.all()

    @property
    def wares(self):
        return Ware.objects.filter(sub_sub_category__sub_category=self)


class SubSubCategory(models.Model):
    sub_category = models.ForeignKey(SubCategory, on_delete=models.CASCADE)
    name = models.CharField(max_length=128)
    slug = models.CharField(max_length=255, blank=False, null=False)
    image = models.ImageField(
        upload_to='uploads/sub-sub-category/',
        null=True,
        blank=True
    )
    image_alt = models.CharField(max_length=255)
    created_on = models.DateTimeField(auto_now_add=True)
    description = models.TextField(null=True, blank=True)
    returned_time = models.PositiveIntegerField(default=24)

    def __str__(self):
        return f'{self.sub_category}, {self.name}'

    @property
    def ware(self):
        return self.ware_set.all()[:10]

    @property
    def brands(self):
        return Brand.objects.filter(ware__sub_sub_category=self).all()


class Tag(models.Model):
    en_name = models.CharField(max_length=255, unique=True, error_messages={
        'unique': "چنین نامی وجود دارد!",
    })
    fa_name = models.CharField(max_length=255, unique=True, error_messages={
        'unique': "چنین نامی وجود دارد!",
    })
    slug = models.CharField(max_length=255, unique=True, error_messages={
        'unique': "چنین نامی وجود دارد!",
    })

    def __str__(self):
        return f'{self.en_name}, {self.fa_name}'


def percentage(percent, whole):
    return ((100 - percent) * whole) / 100.0


class Ware(models.Model):
    id = models.CharField(max_length=255, primary_key=True)
    sub_sub_category = models.ForeignKey(SubSubCategory, on_delete=models.CASCADE, null=True, blank=True)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    en_name = models.CharField(max_length=255, null=True, blank=True)
    rate = models.FloatField(default=0)
    slug = models.SlugField(max_length=255, allow_unicode=True, unique=True, null=True, blank=True)
    # off = models.PositiveIntegerField(default=0)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    criticism = models.TextField(null=True, blank=True)
    thumbnail = models.ImageField(upload_to='uploads/ware/', null=True, blank=True)
    thumbnail_alt = models.CharField(max_length=255, null=True, blank=True)
    info = models.TextField(null=True, blank=True)
    view = models.PositiveIntegerField(default=0)
    tags = models.ManyToManyField('Tag')

    def __str__(self):
        return f'{self.id}'

    # def save(self, *args, **kwargs):
    #     self.slug = self.slug or slugify(self.name)
    #     super().save(*args, **kwargs)

    @property
    def similar_product(self):
        return Ware.objects.filter(brand_id=self.brand_id).exclude(id=self.id).order_by('-view')[:5]

    @property
    def product(self):
        return self.product_set.all()

    @property
    def picture(self):
        return self.pictureware_set.all()

    @property
    def comment(self):
        return self.commentware_set.all()

    @property
    def off(self):
        try:
            qs = self.specialoffer_set.all()
            return qs[0].off
        except IndexError:
            return None

    @property
    def price(self):
        try:
            off = self.specialoffer_set.all()
            price = self.product_set.all().get(default=True).toman_price
            if off:
                off = self.specialoffer_set.all()[0].off
                price = percentage(off, price)
            return price
        except Product.DoesNotExist:
            return 0

    @property
    def sale_count(self):
        return Sale.objects.filter(ware__product__ware=self).count()


class Price(models.Model):
    ware = models.ForeignKey(Ware, on_delete=models.CASCADE, related_name='ware_for_price')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    price = models.FloatField()
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.ware.name}, {self.price}'


class InstantOffer(models.Model):
    ware = models.ForeignKey(Ware, on_delete=models.CASCADE)
    deadline = models.DateTimeField(blank=False, null=False)

    def __str__(self):
        return f'{self.ware.name}, {self.deadline}'


class Sale(models.Model):
    SALE_STATUS = [
        ('waiting', 'در انتظار پرداخت'),
        ('processing', 'سفارش ثبت شد'),
        ('posted', 'ارسال شد'),
        ('delivered', 'تحویل داده شد'),
    ]

    tracking_code = models.CharField(max_length=10, unique=True)
    ware = models.ManyToManyField('ProductOrder')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    user_address = models.ForeignKey(UserAddress, on_delete=models.SET_DEFAULT, default='آدرس توسط کاربر حذف شده است')
    price = models.FloatField()
    off = models.FloatField(default=0)
    created_on = models.DateTimeField(auto_now_add=True)
    description = models.TextField(null=True, blank=True)
    credit_cart = models.IntegerField()
    status = models.CharField(max_length=255, choices=SALE_STATUS, default='processing')

    def __str__(self):
        return f'{self.id}, {self.user.phone_number}, {self.status}'


class ReturnedWare(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE)
    ware = models.ManyToManyField('Ware')
    created_on = models.DateTimeField(auto_now=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return f'{self.id}, {self.sale.id}'


class CommentWare(models.Model):
    ware = models.ForeignKey(Ware, on_delete=models.CASCADE)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    created_on = models.DateTimeField(auto_now_add=True)
    body = models.TextField()
    star = models.IntegerField(default=0, validators=[MaxValueValidator(5), MinValueValidator(0)])

    def __str__(self):
        return f'{self.ware}, {self.user}, {self.star}'


class SpecialOffer(models.Model):
    ware = models.ForeignKey(Ware, on_delete=models.CASCADE)
    description = models.TextField(null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)
    duration = models.DurationField()
    off = models.FloatField()

    def __str__(self):
        return f'{self.ware}, {self.created_on}, {self.duration}, {self.off}'


class PictureWare(models.Model):
    ware = models.ForeignKey(Ware, on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)
    description = models.TextField(null=True, blank=True)
    picture = models.ImageField(upload_to='uploads/ware/')
    picture_alt = models.CharField(max_length=255)
    ordering = models.PositiveIntegerField()

    def __str__(self):
        return self.ware.name

    class Meta:
        unique_together = ('ware', 'ordering',)


class Color(models.Model):
    name = models.CharField(max_length=255, unique=True)
    hex_code = models.CharField(max_length=6, unique=True)

    def __str__(self):
        return self.name


class Dollar(models.Model):
    real_price = models.PositiveIntegerField(default=0)
    manual_price = models.PositiveIntegerField(default=0)

    def __str__(self):
        return str(self.real_price)


class Product(models.Model):
    ware = models.ForeignKey(Ware, on_delete=models.CASCADE)
    color = models.ForeignKey(Color, on_delete=models.CASCADE, null=True, blank=True)
    price = models.PositiveIntegerField(default=0)
    stock = models.PositiveIntegerField(default=0, null=True, blank=True)
    manual = models.BooleanField(default=False)
    default = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.ware}'

    # class Meta:
    #     unique_together = ('ware', 'color',)

    @property
    def toman_price(self):
        if self.manual:
            dollar_price = Dollar.objects.first().manual_price
        elif not self.manual:
            dollar_price = Dollar.objects.first().real_price
        return self.price*int(dollar_price)

    def save(self, *args, **kwargs):
        if not self.default:
            try:
                Product.objects.get(ware=self.ware, default=True)
            except Product.DoesNotExist:
                self.default = True
        elif self.default:
            try:
                temp = Product.objects.get(ware=self.ware, default=True)
                temp.default = False
                temp.save()
            except Product.DoesNotExist:
                pass
        super(Product, self).save(*args, **kwargs)


class ProductOrder(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    ordered = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user}, x{self.quantity} {self.product.color} {self.product.ware.name}"

    # def save(self, *args, **kwargs):
    #     same_product = ProductOrder.objects.filter(user=self.user, ordered=False).values_list('product_id', flat=True)
    #     print(same_product)
    #     if self.product_id in same_product:
    #         pass
    #     else:
    #         super(ProductOrder, self).save(*args, **kwargs)

    @property
    def price(self):
        off = self.product.ware.specialoffer_set.all()
        price = self.product.price * self.quantity
        if off:
            price = percentage(off, price) * self.quantity
        return price


class Report(models.Model):
    SUBJECT = [
        ('Tracking', 'پیگیری سفارش'),
        ('Criticism', 'انتقادات و پیشنهادات'),
        ('Other', 'موضوعات دیگر'),
    ]
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    sale_tracking_code = models.IntegerField(blank=True, null=True)
    subject = models.CharField(max_length=255, choices=SUBJECT)
    created_on = models.DateTimeField(auto_now_add=True)
    body = models.TextField()

    def __str__(self):
        return f'{self.id}, {self.user}'


class UserView(models.Model):
    ip = models.CharField(max_length=255)
    ware = models.ForeignKey(
        Ware,
        on_delete=models.CASCADE
    )
    date = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('ip', 'ware',)

    def __str__(self):
        return f'{self.ip}, {self.ware.name}'


class FavoriteWare(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    ware = models.ForeignKey(
        Ware,
        on_delete=models.CASCADE
    )

    class Meta:
        unique_together = ('user', 'ware',)

    def __str__(self):
        return f'{self.user}, {self.ware.name}'


class FeatureHeader(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class FeatureName(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Feature(models.Model):
    header = models.ForeignKey(FeatureHeader, on_delete=models.CASCADE)
    name = models.ForeignKey(FeatureName, on_delete=models.CASCADE)
    ware = models.ForeignKey(Ware, on_delete=models.CASCADE)
    value = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.header}, {self.name}, {self.value}'
