from django.urls import path
from . import views

urlpatterns = [
    path('', views.deneme),
    path('make_reservation/', views.make_reservation),
    path('view_reservation/', views.deneme),
    path('manager/', views.reservation_database_manager),
]