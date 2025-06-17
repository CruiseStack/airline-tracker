#!/usr/bin/env python
import os
import sys
import django

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airline_tracker.settings')
django.setup()

from flights.models import FlightClass, Passenger, FlightInstance

print('FlightClass objects:')
for fc in FlightClass.objects.all():
    print(f'ID: {fc.id}, Class: {fc.class_type}')

print('\nPassenger objects:')
for p in Passenger.objects.all():
    print(f'ID: {p.id}, Name: {p.first_name} {p.last_name}')

print('\nFlightInstance objects (first 5):')
for fi in FlightInstance.objects.all()[:5]:
    print(f'ID: {fi.id}, Flight: {fi.flight.fnum}, Date: {fi.date}')

print('\nTotal counts:')
print(f'FlightClass: {FlightClass.objects.count()}')
print(f'Passenger: {Passenger.objects.count()}')
print(f'FlightInstance: {FlightInstance.objects.count()}')
