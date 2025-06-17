#!/usr/bin/env python
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airline_tracker.settings')
django.setup()

from ticket.models import Ticket
from flights.models import Payment

# Delete recent test tickets that are unpaid
print("=== Cleaning up unpaid tickets ===")
recent_tickets = Ticket.objects.filter(payment__paid_cash=0, payment__paid_points=0)
print(f"Found {recent_tickets.count()} unpaid tickets")

for ticket in recent_tickets:
    print(f"Deleting ticket: {ticket.ticket_number}")
    if ticket.payment:
        ticket.payment.delete()
    ticket.delete()

print("Cleanup complete!")
