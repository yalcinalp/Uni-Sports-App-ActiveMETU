from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.LoginAPI.as_view()),
    path('logout/', views.LogoutAPI.as_view()),
    path('change_password/', views.ChangePasswordAPI.as_view()),
]
