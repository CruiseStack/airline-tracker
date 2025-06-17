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
from flights.models import FlightInstance, FlightClass
from accounts.models import CustomUser

# Clear existing tickets
print("Clearing existing tickets...")
Ticket.objects.all().delete()

# Get valid objects
user = CustomUser.objects.get(id=1)
flight_instance = FlightInstance.objects.get(id=1)
flight_class = FlightClass.objects.get(class_type='Economy')

print(f"User: {user.email}")
print(f"FlightInstance: {flight_instance}")
print(f"FlightClass: {flight_class}")

# Create a test ticket manually
ticket_data = {
    'ticket_number': 'TK12345',
    'PNR_number': 'PNR12345',
    'checkin_status': 'not_checked_in',
    'seat_number': 'A1',
    'extra_baggage': False,
    'flight_instance': flight_instance,
    'flight_class': flight_class,
    'user': user,
    'payment': None  # We'll set this later
}

try:
    ticket = Ticket.objects.create(**ticket_data)
    print(f"Created ticket: {ticket}")
    print("Ticket creation successful!")
except Exception as e:
    print(f"Error creating ticket: {e}")
    import traceback
    traceback.print_exc()
