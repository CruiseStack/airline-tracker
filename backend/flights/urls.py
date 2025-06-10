from django.urls import path
from . import views

urlpatterns = [
    path('', views.flight_list, name='flight-list'),
    path('menu/', views.flight_menu, name='flight-menu'),
    path('<int:flight_id>/', views.flight_detail, name='flight-detail'),
    path('my-flights/', views.my_flights, name='my-flights'),
]
