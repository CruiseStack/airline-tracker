#!/usr/bin/env python
import os
import sys
import django

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airline_tracker.settings')
django.setup()

from flights.models import FlightInstance

print("Checking FlightInstance objects...")
flight_instances = FlightInstance.objects.all()[:5]  # Get first 5

if flight_instances:
    print("FlightInstance objects found:")
    for fi in flight_instances:
        print(f"ID: {fi.id}, Flight: {fi.flight.fnum}, Date: {fi.date}, Origin: {fi.flight.origin.name}, Destination: {fi.flight.destination.name}")
else:
    print("No FlightInstance objects found in database.")
    
print(f"\nTotal FlightInstances: {FlightInstance.objects.count()}")
