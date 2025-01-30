from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('view_events/', views.view_events, name="view_events"),
]