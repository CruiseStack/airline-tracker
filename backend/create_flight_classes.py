#!/usr/bin/env python
import os
import sys
import django

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airline_tracker.settings')
django.setup()

from flights.models import FlightClass

# Create basic flight classes if they don't exist
flight_classes = [
    {'class_type': 'Economy', 'baggage': 20, 'carry_on': 8},
    {'class_type': 'Premium Economy', 'baggage': 25, 'carry_on': 10},
    {'class_type': 'Business', 'baggage': 32, 'carry_on': 12},
    {'class_type': 'First', 'baggage': 40, 'carry_on': 15}
]

print("Creating FlightClass objects...")
for fc_data in flight_classes:
    flight_class, created = FlightClass.objects.get_or_create(
        class_type=fc_data['class_type'],
        defaults={
            'baggage': fc_data['baggage'],
            'carry_on': fc_data['carry_on']
        }
    )
    if created:
        print(f"Created FlightClass: {flight_class.class_type}")
    else:
        print(f"FlightClass already exists: {flight_class.class_type}")

print("\nFlightClass objects:")
for fc in FlightClass.objects.all():
    print(f"Class Type: {fc.class_type}, Baggage: {fc.baggage}kg, Carry-on: {fc.carry_on}kg")
