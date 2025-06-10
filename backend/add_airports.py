#!/usr/bin/env python
"""
Script to add comprehensive airport data to the flights app.
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airline_tracker.settings')
django.setup()

from flights.models import Airport

# Popular airports data
airports_data = [
    # Existing airports will be updated, new ones will be created
    {'code': 'IST', 'name': 'Istanbul Airport', 'city': 'Istanbul', 'country': 'Turkey'},
    {'code': 'DXB', 'name': 'Dubai International Airport', 'city': 'Dubai', 'country': 'UAE'},
    {'code': 'FRA', 'name': 'Frankfurt Airport', 'city': 'Frankfurt', 'country': 'Germany'},
    {'code': 'LHR', 'name': 'Heathrow Airport', 'city': 'London', 'country': 'United Kingdom'},
    {'code': 'JFK', 'name': 'John F. Kennedy International Airport', 'city': 'New York', 'country': 'United States'},
    
    # Additional popular airports
    {'code': 'ATL', 'name': 'Hartsfield-Jackson Atlanta International Airport', 'city': 'Atlanta', 'country': 'United States'},
    {'code': 'LAX', 'name': 'Los Angeles International Airport', 'city': 'Los Angeles', 'country': 'United States'},
    {'code': 'ORD', 'name': "O'Hare International Airport", 'city': 'Chicago', 'country': 'United States'},
    {'code': 'LAS', 'name': 'McCarran International Airport', 'city': 'Las Vegas', 'country': 'United States'},
    {'code': 'MIA', 'name': 'Miami International Airport', 'city': 'Miami', 'country': 'United States'},
    
    # European airports
    {'code': 'CDG', 'name': 'Charles de Gaulle Airport', 'city': 'Paris', 'country': 'France'},
    {'code': 'AMS', 'name': 'Amsterdam Schiphol Airport', 'city': 'Amsterdam', 'country': 'Netherlands'},
    {'code': 'MAD', 'name': 'Adolfo Suárez Madrid-Barajas Airport', 'city': 'Madrid', 'country': 'Spain'},
    {'code': 'BCN', 'name': 'Barcelona-El Prat Airport', 'city': 'Barcelona', 'country': 'Spain'},
    {'code': 'FCO', 'name': 'Leonardo da Vinci-Fiumicino Airport', 'city': 'Rome', 'country': 'Italy'},
    {'code': 'MUC', 'name': 'Munich Airport', 'city': 'Munich', 'country': 'Germany'},
    {'code': 'ZUR', 'name': 'Zurich Airport', 'city': 'Zurich', 'country': 'Switzerland'},
    {'code': 'VIE', 'name': 'Vienna International Airport', 'city': 'Vienna', 'country': 'Austria'},
    
    # Asian airports
    {'code': 'NRT', 'name': 'Narita International Airport', 'city': 'Tokyo', 'country': 'Japan'},
    {'code': 'HND', 'name': 'Haneda Airport', 'city': 'Tokyo', 'country': 'Japan'},
    {'code': 'ICN', 'name': 'Incheon International Airport', 'city': 'Seoul', 'country': 'South Korea'},
    {'code': 'SIN', 'name': 'Singapore Changi Airport', 'city': 'Singapore', 'country': 'Singapore'},
    {'code': 'HKG', 'name': 'Hong Kong International Airport', 'city': 'Hong Kong', 'country': 'Hong Kong'},
    {'code': 'BKK', 'name': 'Suvarnabhumi Airport', 'city': 'Bangkok', 'country': 'Thailand'},
    {'code': 'KUL', 'name': 'Kuala Lumpur International Airport', 'city': 'Kuala Lumpur', 'country': 'Malaysia'},
    {'code': 'DEL', 'name': 'Indira Gandhi International Airport', 'city': 'New Delhi', 'country': 'India'},
    {'code': 'BOM', 'name': 'Chhatrapati Shivaji Maharaj International Airport', 'city': 'Mumbai', 'country': 'India'},
    
    # Middle Eastern airports
    {'code': 'DOH', 'name': 'Hamad International Airport', 'city': 'Doha', 'country': 'Qatar'},
    {'code': 'AUH', 'name': 'Abu Dhabi International Airport', 'city': 'Abu Dhabi', 'country': 'UAE'},
    {'code': 'KWI', 'name': 'Kuwait International Airport', 'city': 'Kuwait City', 'country': 'Kuwait'},
    {'code': 'RUH', 'name': 'King Khalid International Airport', 'city': 'Riyadh', 'country': 'Saudi Arabia'},
    
    # Australian airports
    {'code': 'SYD', 'name': 'Sydney Kingsford Smith Airport', 'city': 'Sydney', 'country': 'Australia'},
    {'code': 'MEL', 'name': 'Melbourne Airport', 'city': 'Melbourne', 'country': 'Australia'},
    {'code': 'BNE', 'name': 'Brisbane Airport', 'city': 'Brisbane', 'country': 'Australia'},
    {'code': 'PER', 'name': 'Perth Airport', 'city': 'Perth', 'country': 'Australia'},
    
    # Canadian airports
    {'code': 'YYZ', 'name': 'Toronto Pearson International Airport', 'city': 'Toronto', 'country': 'Canada'},
    {'code': 'YVR', 'name': 'Vancouver International Airport', 'city': 'Vancouver', 'country': 'Canada'},
    {'code': 'YUL', 'name': 'Montréal-Pierre Elliott Trudeau International Airport', 'city': 'Montreal', 'country': 'Canada'},
    {'code': 'YYC', 'name': 'Calgary International Airport', 'city': 'Calgary', 'country': 'Canada'},
    
    # South American airports
    {'code': 'GRU', 'name': 'São Paulo-Guarulhos International Airport', 'city': 'São Paulo', 'country': 'Brazil'},
    {'code': 'GIG', 'name': 'Rio de Janeiro-Galeão International Airport', 'city': 'Rio de Janeiro', 'country': 'Brazil'},
    {'code': 'EZE', 'name': 'Ezeiza International Airport', 'city': 'Buenos Aires', 'country': 'Argentina'},
    {'code': 'SCL', 'name': 'Arturo Merino Benítez International Airport', 'city': 'Santiago', 'country': 'Chile'},
    
    # African airports
    {'code': 'CAI', 'name': 'Cairo International Airport', 'city': 'Cairo', 'country': 'Egypt'},
    {'code': 'JNB', 'name': 'O.R. Tambo International Airport', 'city': 'Johannesburg', 'country': 'South Africa'},
    {'code': 'CPT', 'name': 'Cape Town International Airport', 'city': 'Cape Town', 'country': 'South Africa'},
    {'code': 'ADD', 'name': 'Addis Ababa Bole International Airport', 'city': 'Addis Ababa', 'country': 'Ethiopia'},
    
    # Additional US airports
    {'code': 'DFW', 'name': 'Dallas/Fort Worth International Airport', 'city': 'Dallas', 'country': 'United States'},
    {'code': 'DEN', 'name': 'Denver International Airport', 'city': 'Denver', 'country': 'United States'},
    {'code': 'SFO', 'name': 'San Francisco International Airport', 'city': 'San Francisco', 'country': 'United States'},
    {'code': 'SEA', 'name': 'Seattle-Tacoma International Airport', 'city': 'Seattle', 'country': 'United States'},
    {'code': 'BOS', 'name': 'Logan International Airport', 'city': 'Boston', 'country': 'United States'},
    {'code': 'PHX', 'name': 'Phoenix Sky Harbor International Airport', 'city': 'Phoenix', 'country': 'United States'},
    {'code': 'IAH', 'name': 'George Bush Intercontinental Airport', 'city': 'Houston', 'country': 'United States'},
]

def add_airports():
    """Add or update airports in the database."""
    created_count = 0
    updated_count = 0
    
    for airport_data in airports_data:
        airport, created = Airport.objects.get_or_create(
            code=airport_data['code'],
            defaults=airport_data
        )
        
        if created:
            created_count += 1
            print(f"Created: {airport.code} - {airport.city} ({airport.name})")
        else:
            # Update existing airport with new data
            updated = False
            for field, value in airport_data.items():
                if getattr(airport, field) != value:
                    setattr(airport, field, value)
                    updated = True
            
            if updated:
                airport.save()
                updated_count += 1
                print(f"Updated: {airport.code} - {airport.city} ({airport.name})")
    
    print(f"\nSummary:")
    print(f"Created {created_count} new airports")
    print(f"Updated {updated_count} existing airports")
    print(f"Total airports in database: {Airport.objects.count()}")

if __name__ == '__main__':
    add_airports()
