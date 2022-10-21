from django.shortcuts import render


def profile(request):
    return render(request, 'user_panel/profile.html')


def profile_favorites(request):
    return render(request, 'user_panel/profile-favorites.html')


def profile_personal_info(request):
    return render(request, 'user_panel/profile-personal-info.html')


def profile_orders(request):
    return render(request, 'user_panel/profile-orders.html')


def profile_additional_info(request):
    return render(request, 'user_panel/profile-additional-info.html')


def profile_orders_return(request):
    return render(request, 'user_panel/profile-orders-return.html')


def password_change(request):
    return render(request, 'user_panel/password-change.html')


def verify_phone_number(request):
    return render(request, 'user_panel/verify-phone-number.html')


def cart(request):
    return render(request, 'user_panel/cart.html')


def checkout(request):
    return render(request, 'user_panel/checkout.html')


def login(request):
    return render(request, 'user_panel/login.html')


def signup(request):
    return render(request, 'user_panel/signup.html')


def welcome(request):
    return render(request, 'user_panel/welcome.html')


def forgot_password(request):
    return render(request, 'user_panel/forgot-password.html')


def profile_my_addresses(request):
    return render(request, 'user_panel/my-addresses.html')