#!/usr/bin/env python
import os
import sys
import django

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airline_tracker.settings')
django.setup()

from flights.models import FlightClass, Passenger
from django.contrib.auth.models import User

# Create FlightClass objects if they don't exist
flight_classes = [
    {'class_type': 'Economy', 'baggage': 20, 'carry_on': 10},
    {'class_type': 'Business', 'baggage': 30, 'carry_on': 15},
    {'class_type': 'First', 'baggage': 40, 'carry_on': 20},
]

for fc_data in flight_classes:
    fc, created = FlightClass.objects.get_or_create(
        class_type=fc_data['class_type'],
        defaults={
            'baggage': fc_data['baggage'],
            'carry_on': fc_data['carry_on']
        }
    )
    if created:
        print(f"Created FlightClass: {fc.class_type}")
    else:
        print(f"FlightClass {fc.class_type} already exists")

# Create a default passenger if none exist
if not Passenger.objects.exists():
    # Get the first user to associate with the passenger
    user = User.objects.first()
    if user:
        passenger = Passenger.objects.create(
            first_name="John",
            last_name="Doe",
            email=user.email,
            phone="1234567890",
            birth_date="1990-01-01",
            user=user
        )
        print(f"Created default passenger: {passenger.first_name} {passenger.last_name}")
    else:
        print("No users found to create passenger")
else:
    print("Passengers already exist")

# Print current state
print(f"\nCurrent database state:")
print(f"FlightClass count: {FlightClass.objects.count()}")
print(f"Passenger count: {Passenger.objects.count()}")

print("\nFlightClass objects:")
for fc in FlightClass.objects.all():
    print(f"ID: {fc.id}, Class: {fc.class_type}")

print("\nPassenger objects:")
for p in Passenger.objects.all():
    print(f"ID: {p.id}, Name: {p.first_name} {p.last_name}")
