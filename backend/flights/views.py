from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q
from django.core.paginator import Paginator
from datetime import datetime, timedelta
import random

from .models import (
    Country, City, Airport, Flight, FlightInstance, 
    Aircraft, FlightClass, Passenger, Payment
)
from .serializers import (
    CountrySerializer, CitySerializer, AirportSerializer,
    FlightSerializer, FlightInstanceSerializer, FlightSearchSerializer,
    CitySearchSerializer, AirportSearchSerializer
)


@api_view(['GET'])
@permission_classes([AllowAny])
def search_locations(request):
    """Search both cities and airports by name - for autocomplete functionality"""
    search_term = request.GET.get('search', '').strip()
    
    if not search_term:
        return Response({'results': []})
    
    # Search cities
    cities = City.objects.filter(
        city_name__icontains=search_term
    ).select_related('country')[:5]
    
    # Search airports
    airports = Airport.objects.filter(
        Q(name__icontains=search_term) | 
        Q(iata_code__icontains=search_term)
    ).select_related('city__country')[:5]
    
    # Format results
    results = []
    
    # Add cities
    for city in cities:
        results.append({
            'type': 'city',
            'id': city.city_id,
            'name': city.city_name,
            'display_name': f"{city.city_name}, {city.country.country_name}",
            'country': city.country.country_name,
            'country_code': city.country.country_code
        })
    
    # Add airports
    for airport in airports:
        results.append({
            'type': 'airport',
            'id': airport.iata_code,
            'name': airport.name,
            'display_name': f"{airport.name} ({airport.iata_code})",
            'iata_code': airport.iata_code,
            'city': airport.city.city_name,
            'country': airport.city.country.country_name,
            'country_code': airport.city.country.country_code
        })
    
    return Response({'results': results})


@api_view(['GET'])
@permission_classes([AllowAny])
def search_cities(request):
    """Search cities by name - for autocomplete functionality"""
    search_term = request.GET.get('search', '').strip()
    
    if not search_term:
        return Response({'results': []})
    
    cities = City.objects.filter(
        city_name__icontains=search_term
    ).select_related('country')[:10]
    
    serializer = CitySerializer(cities, many=True)
    return Response({'results': serializer.data})


@api_view(['GET'])
@permission_classes([AllowAny])
def search_airports(request):
    """Search airports by name or IATA code - for autocomplete functionality"""
    search_term = request.GET.get('search', '').strip()
    
    if not search_term:
        return Response({'results': []})
    
    airports = Airport.objects.filter(
        Q(name__icontains=search_term) | 
        Q(iata_code__icontains=search_term)
    ).select_related('city__country')[:10]
    
    serializer = AirportSerializer(airports, many=True)
    return Response({'results': serializer.data})


@api_view(['GET'])
@permission_classes([AllowAny])
def search_flights(request):
    """Search for flights based on criteria"""
    page = int(request.GET.get('page', 1))
    page_size = int(request.GET.get('page_size', 10))
    
    # Get search parameters
    origin = request.GET.get('origin', '').strip()
    destination = request.GET.get('destination', '').strip()
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    
    # Start with all flight instances
    queryset = FlightInstance.objects.all().select_related(
        'flight__origin__city__country',
        'flight__destination__city__country',
        'aircraft'
    )
    
    # Apply filters if provided
    if origin:
        # Search in both city names and airport names/codes
        queryset = queryset.filter(
            Q(flight__origin__city__city_name__icontains=origin) |
            Q(flight__origin__name__icontains=origin) |
            Q(flight__origin__iata_code__icontains=origin)
        )
    
    if destination:
        # Search in both city names and airport names/codes
        queryset = queryset.filter(
            Q(flight__destination__city__city_name__icontains=destination) |
            Q(flight__destination__name__icontains=destination) |
            Q(flight__destination__iata_code__icontains=destination)
        )
    
    if start_date:
        try:
            start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
            queryset = queryset.filter(date__gte=start_date_obj)
        except ValueError:
            pass
    
    if end_date:
        try:
            end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()
            queryset = queryset.filter(date__lte=end_date_obj)
        except ValueError:
            pass
      # If no search criteria provided, show random flights
    if not any([origin, destination, start_date, end_date]):
        # Get random flights for discovery using database-level randomization
        random_flights = queryset.order_by('?')[:page_size]
        total_count = queryset.count()
        
        serializer = FlightInstanceSerializer(random_flights, many=True)
        return Response({
            'results': serializer.data,
            'page': page,
            'page_size': page_size,
            'total': total_count,
            'is_random': True
        })
    
    # Order by date for search results
    queryset = queryset.order_by('date', 'flight__fnum')
    
    # Paginate results
    paginator = Paginator(queryset, page_size)
    page_obj = paginator.get_page(page)
    
    serializer = FlightInstanceSerializer(page_obj.object_list, many=True)
    
    return Response({
        'results': serializer.data,
        'page': page,
        'page_size': page_size,
        'total': paginator.count,
        'total_pages': paginator.num_pages,
        'has_next': page_obj.has_next(),
        'has_previous': page_obj.has_previous(),
        'is_random': False
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def get_random_flights(request):
    """Get random flights for infinite scroll discovery"""
    page_size = int(request.GET.get('page_size', 10))
    
    # Get random flight instances using database-level randomization
    random_flights = FlightInstance.objects.select_related(
        'flight__origin__city__country',
        'flight__destination__city__country',
        'aircraft'
    ).order_by('?')[:page_size]  # Use database random ordering
    
    total_count = FlightInstance.objects.count()
    
    serializer = FlightInstanceSerializer(random_flights, many=True)
    
    return Response({
        'results': serializer.data,
        'total': total_count,
        'page_size': page_size
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def get_popular_destination_flight(request):
    """Get a random flight to the most popular destination (destination with most flights)"""
    from django.db.models import Count
      # Find the most popular destination (city with most flights going to it)
    popular_destination = Flight.objects.values(
        'destination__city__city_name',
        'destination__city__city_id'    ).annotate(
        flight_count=Count('fnum')
    ).order_by('-flight_count').first()
    
    if not popular_destination:
        return Response({'results': []})
      # Get a random flight instance to that popular destination
    popular_flights = FlightInstance.objects.filter(
        flight__destination__city__city_id=popular_destination['destination__city__city_id']
    ).select_related(
        'flight__origin__city__country',
        'flight__destination__city__country',
        'aircraft'
    ).order_by('?')[:1]  # Get one random flight
    
    if not popular_flights:
        return Response({'results': []})
    
    serializer = FlightInstanceSerializer(popular_flights, many=True)
    
    return Response({
        'results': serializer.data,
        'popular_destination': popular_destination['destination__city__city_name'],
        'flight_count_to_destination': popular_destination['flight_count']
    })
