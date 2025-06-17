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
from accounts.models import CustomUser

try:
    user = CustomUser.objects.get(email='apolat21@ku.edu.tr')
    print(f'Tickets for user {user.email}:')
    
    tickets = Ticket.objects.filter(user=user)
    print(f'Total tickets: {tickets.count()}')
    
    for ticket in tickets:
        print(f'- Ticket: {ticket.ticket_number}')
        print(f'  Flight: {ticket.flight_instance.flight.fnum}')
        print(f'  Date: {ticket.flight_instance.date}')
        print(f'  Class: {ticket.flight_class.class_type}')
        print(f'  Created: {ticket.ticketing_timestamp}')
        print()
        
except Exception as e:
    print(f'Error: {e}')
