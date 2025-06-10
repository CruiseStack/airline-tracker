#!/usr/bin/env python
"""
Simple script to create a few test flights.
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airline_tracker.settings')
django.setup()

from flights.models import Airport, Airline, Flight
from datetime import datetime, timedelta

def create_test_flights():
    """Create a few test flights for today and tomorrow."""
    
    # Get some airports and airlines
    try:
        ist = Airport.objects.get(code='IST')
        lhr = Airport.objects.get(code='LHR')
        jfk = Airport.objects.get(code='JFK')
        dxb = Airport.objects.get(code='DXB')
        cdg = Airport.objects.get(code='CDG')
        
        tk = Airline.objects.get(code='TK')
        ek = Airline.objects.get(code='EK')
        lh = Airline.objects.get(code='LH')
    except Exception as e:
        print(f"Error getting airports/airlines: {e}")
        return
    
    # Create flights for today and tomorrow
    base_date = datetime.now().date()
    
    flights_to_create = [
        # Today's flights
        {
            'airline': tk, 'flight_number': '123', 
            'departure_airport': ist, 'arrival_airport': lhr,
            'date': base_date, 'departure_time': '08:00', 'duration_hours': 4,
            'price': 350, 'status': 'scheduled'
        },
        {
            'airline': ek, 'flight_number': '456', 
            'departure_airport': dxb, 'arrival_airport': jfk,
            'date': base_date, 'departure_time': '14:30', 'duration_hours': 14,
            'price': 1200, 'status': 'scheduled'
        },
        {
            'airline': lh, 'flight_number': '789', 
            'departure_airport': cdg, 'arrival_airport': ist,
            'date': base_date, 'departure_time': '18:45', 'duration_hours': 3,
            'price': 280, 'status': 'delayed'
        },
        
        # Tomorrow's flights
        {
            'airline': tk, 'flight_number': '124', 
            'departure_airport': lhr, 'arrival_airport': ist,
            'date': base_date + timedelta(days=1), 'departure_time': '10:15', 'duration_hours': 4,
            'price': 380, 'status': 'scheduled'
        },
        {
            'airline': ek, 'flight_number': '457', 
            'departure_airport': jfk, 'arrival_airport': dxb,
            'date': base_date + timedelta(days=1), 'departure_time': '22:00', 'duration_hours': 12,
            'price': 1100, 'status': 'scheduled'
        },
    ]
    
    created_count = 0
    for flight_data in flights_to_create:
        # Parse time
        time_parts = flight_data['departure_time'].split(':')
        departure_hour = int(time_parts[0])
        departure_minute = int(time_parts[1])
        
        departure_datetime = datetime.combine(
            flight_data['date'], 
            datetime.min.time().replace(hour=departure_hour, minute=departure_minute)
        )
        
        arrival_datetime = departure_datetime + timedelta(hours=flight_data['duration_hours'])
        
        # Check if flight exists
        if not Flight.objects.filter(
            airline=flight_data['airline'],
            flight_number=flight_data['flight_number'],
            scheduled_departure__date=flight_data['date']
        ).exists():
            
            flight = Flight.objects.create(
                airline=flight_data['airline'],
                flight_number=flight_data['flight_number'],
                departure_airport=flight_data['departure_airport'],
                arrival_airport=flight_data['arrival_airport'],
                scheduled_departure=departure_datetime,
                scheduled_arrival=arrival_datetime,
                status=flight_data['status'],
                price=flight_data['price'],
                aircraft_type='Boeing 737',
                duration=f"{flight_data['duration_hours']}h 0m"
            )
            created_count += 1
            print(f"Created: {flight.airline.code}{flight.flight_number} {flight.departure_airport.code}->{flight.arrival_airport.code} on {flight_data['date']}")
    
    print(f"\nCreated {created_count} test flights")
    print(f"Total flights in database: {Flight.objects.count()}")

if __name__ == '__main__':
    create_test_flights()
