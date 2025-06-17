from django.urls import path
from . import views

urlpatterns = [
    path('search-locations/', views.search_locations, name='search_locations'),
    path('search-cities/', views.search_cities, name='search_cities'),
    path('search-airports/', views.search_airports, name='search_airports'),
    path('search-flights/', views.search_flights, name='search_flights'),
    path('random-flights/', views.get_random_flights, name='random_flights'),
    path('popular-destination-flight/', views.get_popular_destination_flight, name='popular_destination_flight'),
]
