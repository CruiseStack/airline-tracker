#!/usr/bin/env python
import os
import sys
import django

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airline_tracker.settings')
django.setup()

from ticket.models import Ticket
from flights.models import Passenger
from accounts.models import CustomUser

print("=== Current Database State ===")
print(f"Total tickets: {Ticket.objects.count()}")
print(f"Total passengers: {Passenger.objects.count()}")
print(f"Total users: {CustomUser.objects.count()}")

print("\n=== Recent Tickets ===")
for ticket in Ticket.objects.select_related('passenger', 'user', 'flight_instance__flight').order_by('-ticketing_timestamp')[:5]:
    passenger_name = f"{ticket.passenger.first_name} {ticket.passenger.last_name}" if ticket.passenger else "No passenger"
    flight_num = ticket.flight_instance.flight.fnum if ticket.flight_instance else "No flight"
    print(f"Ticket: {ticket.ticket_number}")
    print(f"  Flight: {flight_num}")
    print(f"  Passenger: {passenger_name}")
    print(f"  User: {ticket.user.email}")
    print(f"  Date: {ticket.ticketing_timestamp}")
    print("---")

print("\n=== Recent Passengers ===")
for passenger in Passenger.objects.order_by('-passenger_id')[:5]:
    print(f"Passenger ID: {passenger.passenger_id}")
    print(f"  Name: {passenger.first_name} {passenger.last_name}")
    print(f"  Email: {passenger.email}")
    print(f"  Phone: {passenger.phone_number}")
    print(f"  ID: {passenger.id_type} - {passenger.id_number}")
    print("---")
