#!/usr/bin/env python
"""
Script to add more sample flight data to make search more interesting.
"""
import os
import django
from datetime import datetime, timedelta, time
import random

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airline_tracker.settings')
django.setup()

from flights.models import Airport, Airline, Flight

def create_sample_flights():
    """Create diverse sample flight data."""
    
    # Get all airports and airlines
    airports = list(Airport.objects.all())
    airlines = list(Airline.objects.all())
    
    print(f"Found {len(airports)} airports and {len(airlines)} airlines")
    
    if len(airports) < 10 or len(airlines) < 1:
        print("Need at least 10 airports and 1 airline. Run add_airports.py first.")
        return
    
    # Define some simpler routes with airports we know exist
    popular_routes = [
        ('IST', 'LHR'), ('LHR', 'JFK'), ('JFK', 'LAX'), ('DXB', 'FRA'),
        ('CDG', 'IST'), ('AMS', 'DXB'), ('MAD', 'LHR'), ('FCO', 'CDG'),
        ('NRT', 'LAX'), ('ICN', 'SFO'), ('SIN', 'LHR'), ('HKG', 'JFK'),
        ('BKK', 'FRA'), ('DEL', 'DXB'), ('DOH', 'LHR'), ('SYD', 'SIN'),
        ('MEL', 'DXB'), ('YYZ', 'LHR'), ('GRU', 'CDG'), ('EZE', 'MAD'),
    ]
    
    # Create flights for the next 3 days (keep it simple)
    base_date = datetime.now().date()
    status_choices = ['scheduled', 'delayed']
    
    created_count = 0
    
    for day_offset in range(3):  # Next 3 days
        flight_date = base_date + timedelta(days=day_offset)
        print(f"Creating flights for {flight_date}")
        
        for departure_code, arrival_code in popular_routes[:10]:  # Only first 10 routes
            try:
                departure_airport = Airport.objects.get(code=departure_code)
                arrival_airport = Airport.objects.get(code=arrival_code)
                airline = random.choice(airlines)
                
                # Simple flight creation
                departure_hour = random.randint(8, 20)
                departure_time = time(departure_hour, 0)
                
                duration_hours = random.randint(2, 8)
                arrival_datetime = datetime.combine(flight_date, departure_time) + timedelta(hours=duration_hours)
                
                flight_number = f"{random.randint(100, 999)}"
                price = random.randint(200, 800)
                
                # Check if flight already exists
                if not Flight.objects.filter(
                    airline=airline,
                    flight_number=flight_number,
                    departure_airport=departure_airport,
                    arrival_airport=arrival_airport,
                    scheduled_departure__date=flight_date
                ).exists():
                    
                    flight = Flight.objects.create(
                        airline=airline,
                        flight_number=flight_number,
                        departure_airport=departure_airport,
                        arrival_airport=arrival_airport,
                        scheduled_departure=datetime.combine(flight_date, departure_time),
                        scheduled_arrival=arrival_datetime,
                        status=random.choice(status_choices),
                        price=price,
                        aircraft_type=random.choice(['A320', 'B737', 'A330', 'B777']),
                        duration=f"{duration_hours}h 0m"
                    )
                    created_count += 1
                    print(f"Created flight: {airline.code}{flight_number} {departure_code}->{arrival_code}")
                        
            except Airport.DoesNotExist as e:
                print(f"Airport not found: {e}")
                continue
            except Exception as e:
                print(f"Error creating flight: {e}")
                continue
                
    print(f"\nCreated {created_count} new flights")
    print(f"Total flights in database: {Flight.objects.count()}")

if __name__ == '__main__':
    create_sample_flights()
