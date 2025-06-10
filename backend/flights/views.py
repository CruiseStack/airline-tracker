from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from datetime import datetime, timedelta
from .models import Flight, Airport, Airline
from .serializers import FlightListSerializer, FlightDetailSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def flight_list(request):
    """List all flights with optional filtering"""
    flights = Flight.objects.all()
    
    # Filter by departure airport
    departure = request.GET.get('departure')
    if departure:
        flights = flights.filter(departure_airport__code__icontains=departure)
    
    # Filter by arrival airport
    arrival = request.GET.get('arrival')
    if arrival:
        flights = flights.filter(arrival_airport__code__icontains=arrival)
    
    # Filter by date
    date = request.GET.get('date')
    if date:
        try:
            filter_date = datetime.strptime(date, '%Y-%m-%d').date()
            flights = flights.filter(scheduled_departure__date=filter_date)
        except ValueError:
            return Response(
                {'error': 'Invalid date format. Use YYYY-MM-DD'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    # Filter by status
    flight_status = request.GET.get('status')
    if flight_status:
        flights = flights.filter(status=flight_status)
    
    # Search by flight number or airline
    search = request.GET.get('search')
    if search:
        flights = flights.filter(
            Q(flight_number__icontains=search) |
            Q(airline__name__icontains=search) |
            Q(airline__code__icontains=search)
        )
    
    serializer = FlightListSerializer(flights, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def flight_detail(request, flight_id):
    """Get detailed information about a specific flight"""
    try:
        flight = Flight.objects.get(id=flight_id)
        serializer = FlightDetailSerializer(flight)
        return Response(serializer.data)
    except Flight.DoesNotExist:
        return Response(
            {'error': 'Flight not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_flights(request):
    """Get flights booked by the current user"""
    user_bookings = request.user.flightbooking_set.all()
    flights = [booking.flight for booking in user_bookings]
    serializer = FlightListSerializer(flights, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def flight_menu(request):
    """Get flight menu data including airports and airlines for filtering"""
    airports = Airport.objects.all().values('id', 'name', 'code', 'city', 'country')
    airlines = Airline.objects.all().values('id', 'name', 'code', 'country')
    
    # Get available flight statuses
    status_choices = [
        {'value': choice[0], 'label': choice[1]} 
        for choice in Flight.FLIGHT_STATUS_CHOICES
    ]
    
    return Response({
        'airports': list(airports),
        'airlines': list(airlines),
        'status_choices': status_choices,
        'today': datetime.now().date().isoformat(),
    })
