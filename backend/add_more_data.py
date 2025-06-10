#!/usr/bin/env python
"""
Add more sample data for testing
"""
import os
import sys
import django
from pathlib import Path

def setup_django():
    """Setup Django environment"""
    backend_dir = Path(__file__).parent
    sys.path.insert(0, str(backend_dir))
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airline_tracker.settings')
    django.setup()

def add_more_data():
    """Add more sample data"""
    from flights.models import Airline, Airport, Flight
    from django.utils import timezone
    from datetime import datetime, timedelta
    import random

    print("Adding more sample data...")

    # Get existing data
    airlines = list(Airline.objects.all())
    airports = list(Airport.objects.all())

    # Add more airports
    more_airports = [
        {'name': 'Barcelona Airport', 'code': 'BCN', 'city': 'Barcelona', 'country': 'Spain'},
        {'name': 'Rome Fiumicino', 'code': 'FCO', 'city': 'Rome', 'country': 'Italy'},
        {'name': 'Amsterdam Schiphol', 'code': 'AMS', 'city': 'Amsterdam', 'country': 'Netherlands'},
    ]

    for data in more_airports:
        airport, created = Airport.objects.get_or_create(**data)
        if created:
            airports.append(airport)
            print(f'Created airport: {airport.name}')

    # Create more flights for the next 3 days
    today = timezone.now().date()
    statuses = ['scheduled', 'delayed', 'boarding']
    aircraft_types = ['Boeing 737', 'Airbus A320', 'Boeing 777', 'Airbus A330']
    gates = ['A', 'B', 'C']

    flight_count = 0
    for day in range(3):
        flight_date = today + timedelta(days=day)
        
        # Create 8-12 flights per day
        daily_flights = random.randint(8, 12)
        for i in range(daily_flights):
            # Random departure time
            departure_hour = random.randint(6, 22)
            departure_minute = random.choice([0, 15, 30, 45])
            
            scheduled_departure = timezone.make_aware(
                datetime.combine(flight_date, datetime.min.time().replace(
                    hour=departure_hour, minute=departure_minute
                ))
            )
            
            # Flight duration between 2-8 hours
            duration_hours = random.randint(2, 8)
            duration_minutes = random.choice([0, 15, 30, 45])
            scheduled_arrival = scheduled_departure + timedelta(
                hours=duration_hours, minutes=duration_minutes
            )
            
            # Random airports (ensure departure != arrival)
            departure_airport = random.choice(airports)
            arrival_airports = [a for a in airports if a != departure_airport]
            arrival_airport = random.choice(arrival_airports)
            
            # Random airline
            airline = random.choice(airlines)
            
            # Flight number
            flight_number = f'{random.randint(100, 999)}'
            
            # Price between $200-$1500
            price = random.randint(200, 1500)
            
            flight_data = {
                'flight_number': flight_number,
                'airline': airline,
                'departure_airport': departure_airport,
                'arrival_airport': arrival_airport,
                'scheduled_departure': scheduled_departure,
                'scheduled_arrival': scheduled_arrival,
                'status': random.choice(statuses),
                'aircraft_type': random.choice(aircraft_types),
                'gate': f'{random.choice(gates)}{random.randint(1, 25)}',
                'terminal': random.randint(1, 3),
                'price': price,
            }
            
            # Check if similar flight exists
            if not Flight.objects.filter(
                flight_number=flight_number,
                scheduled_departure__date=flight_date,
                airline=airline
            ).exists():
                flight = Flight.objects.create(**flight_data)
                flight_count += 1

    print(f'Created {flight_count} additional flights')
    print(f'Total Flights: {Flight.objects.count()}')
    print(f'Total Airports: {Airport.objects.count()}')

def main():
    setup_django()
    add_more_data()

if __name__ == '__main__':
    main()
