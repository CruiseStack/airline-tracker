#!/usr/bin/env python
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airline_tracker.settings')
django.setup()

from ticket.models import Ticket
from flights.models import Payment

print("=== Payment Status Check ===")
tickets = Ticket.objects.all()
for ticket in tickets:
    print(f"Ticket: {ticket.ticket_number}")
    if ticket.payment:
        payment = ticket.payment
        print(f"  Payment Number: {payment.payment_number}")
        print(f"  Total: ${payment.total}")
        print(f"  Paid Cash: ${payment.paid_cash}")
        print(f"  Paid Points: {payment.paid_points}")
        print(f"  Is Paid (calculated): {payment.paid_cash > 0 or payment.paid_points > 0}")
        print("---")
    else:
        print("  No payment associated")
        print("---")

print("\n=== All Payments ===")
payments = Payment.objects.all()
for payment in payments:
    print(f"Payment: {payment.payment_number}")
    print(f"  Total: ${payment.total}")
    print(f"  Paid Cash: ${payment.paid_cash}")
    print(f"  Paid Points: {payment.paid_points}")
    print(f"  Is Paid (calculated): {payment.paid_cash > 0 or payment.paid_points > 0}")
    print("---")
