#!/usr/bin/env python
"""
Sample data creation script for AirTracker
"""
import os
import sys
import django
from pathlib import Path

def setup_django():
    """Setup Django environment"""
    # Add the backend directory to Python path
    backend_dir = Path(__file__).parent
    sys.path.insert(0, str(backend_dir))
    
    # Set Django settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airline_tracker.settings')
    django.setup()

def create_sample_data():
    """Create sample airlines, airports, and flights"""
    from flights.models import Airline, Airport, Flight
    from django.utils import timezone
    from datetime import datetime, timedelta
    import random

    print("Creating sample flight data...")

    # Create Airlines
    airlines_data = [
        {'name': 'Turkish Airlines', 'code': 'TK', 'country': 'Turkey'},
        {'name': 'Emirates', 'code': 'EK', 'country': 'UAE'},
        {'name': 'Lufthansa', 'code': 'LH', 'country': 'Germany'},
        {'name': 'British Airways', 'code': 'BA', 'country': 'UK'},
        {'name': 'Air France', 'code': 'AF', 'country': 'France'},
        {'name': 'American Airlines', 'code': 'AA', 'country': 'USA'},
    ]

    airlines = []
    for airline_data in airlines_data:
        airline, created = Airline.objects.get_or_create(**airline_data)
        airlines.append(airline)
        if created:
            print(f'Created airline: {airline.name}')

    # Create Airports
    airports_data = [
        {'name': 'Istanbul Airport', 'code': 'IST', 'city': 'Istanbul', 'country': 'Turkey'},
        {'name': 'Sabiha Gokcen Airport', 'code': 'SAW', 'city': 'Istanbul', 'country': 'Turkey'},
        {'name': 'Ankara Esenboga Airport', 'code': 'ESB', 'city': 'Ankara', 'country': 'Turkey'},
        {'name': 'Dubai International', 'code': 'DXB', 'city': 'Dubai', 'country': 'UAE'},
        {'name': 'Frankfurt Airport', 'code': 'FRA', 'city': 'Frankfurt', 'country': 'Germany'},
        {'name': 'Heathrow Airport', 'code': 'LHR', 'city': 'London', 'country': 'UK'},
        {'name': 'Charles de Gaulle', 'code': 'CDG', 'city': 'Paris', 'country': 'France'},
        {'name': 'JFK International', 'code': 'JFK', 'city': 'New York', 'country': 'USA'},
        {'name': 'Los Angeles International', 'code': 'LAX', 'city': 'Los Angeles', 'country': 'USA'},
        {'name': 'Tokyo Haneda', 'code': 'HND', 'city': 'Tokyo', 'country': 'Japan'},
    ]

    airports = []
    for airport_data in airports_data:
        airport, created = Airport.objects.get_or_create(**airport_data)
        airports.append(airport)
        if created:
            print(f'Created airport: {airport.name}')

    # Create Flights for the next 7 days
    statuses = ['scheduled', 'delayed', 'boarding', 'departed']
    aircraft_types = ['Boeing 737', 'Airbus A320', 'Boeing 777', 'Airbus A330', 'Boeing 787']
    
    flight_count = 0
    for day in range(7):  # Next 7 days
        flight_date = timezone.now().date() + timedelta(days=day)
        
        # Create 10-15 flights per day
        daily_flights = random.randint(10, 15)
        for _ in range(daily_flights):
            # Random departure time between 6 AM and 11 PM
            departure_hour = random.randint(6, 23)
            departure_minute = random.randint(0, 59)
            
            scheduled_departure = timezone.make_aware(
                datetime.combine(flight_date, datetime.min.time().replace(
                    hour=departure_hour, minute=departure_minute
                ))
            )
            
            # Flight duration between 1-12 hours
            duration_hours = random.randint(1, 12)
            duration_minutes = random.randint(0, 59)
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
            
            # Price between $150-$2000
            price = random.randint(150, 2000)
            
            flight_data = {
                'flight_number': flight_number,
                'airline': airline,
                'departure_airport': departure_airport,
                'arrival_airport': arrival_airport,
                'scheduled_departure': scheduled_departure,
                'scheduled_arrival': scheduled_arrival,
                'status': random.choice(statuses),
                'aircraft_type': random.choice(aircraft_types),
                'gate': f'{random.choice(["A", "B", "C"])}{random.randint(1, 20)}',
                'terminal': random.randint(1, 3),
                'price': price,
            }
            
            # Check if flight already exists
            if not Flight.objects.filter(
                flight_number=flight_number,
                scheduled_departure=scheduled_departure,
                airline=airline
            ).exists():
                flight = Flight.objects.create(**flight_data)
                flight_count += 1

    print(f'Successfully created {flight_count} flights for the next 7 days!')
    print(f'Total Airlines: {Airline.objects.count()}')
    print(f'Total Airports: {Airport.objects.count()}')
    print(f'Total Flights: {Flight.objects.count()}')

def main():
    """Main function"""
    setup_django()
    create_sample_data()
    print("Sample data creation complete!")

if __name__ == '__main__':
    main()
