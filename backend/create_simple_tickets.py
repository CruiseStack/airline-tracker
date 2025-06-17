#!/usr/bin/env python
import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airline_tracker.settings')
django.setup()

from ticket.models import Ticket
from flights.models import Payment, FlightInstance, FlightClass, Passenger
from accounts.models import CustomUser
from decimal import Decimal

def create_tickets():
    user = CustomUser.objects.first()
    print(f'Using user: {user.username if user else "None"}')
    
    if not user:
        print("No user found")
        return
    
    # Get required objects
    fi = FlightInstance.objects.first()
    fc = FlightClass.objects.first()
    passenger = Passenger.objects.first()
    
    print(f"FlightInstance: {fi}")
    print(f"FlightClass: {fc}")
    print(f"Passenger: {passenger}")
    
    if not all([fi, fc, passenger]):
        print("Missing required data")
        return
    
    # Create 3 test tickets
    for i in range(3):
        ticket_num = f'TK{1000+i}'
        
        if Ticket.objects.filter(ticket_number=ticket_num).exists():
            print(f'Ticket {ticket_num} already exists')
            continue
            
        # Create payment
        payment = Payment.objects.create(
            base_price=Decimal('200.00'),
            tax=Decimal('16.00'),
            total=Decimal('216.00'),
            paid_cash=Decimal('216.00') if i % 2 == 0 else Decimal('0'),
            paid_points=0 if i % 2 == 0 else 2160
        )
        
        # Create ticket
        ticket = Ticket.objects.create(
            ticket_number=ticket_num,
            PNR_number=f'PNR{1000+i}',
            seat_number=f'{i+1}A',
            flight_instance=fi,
            flight_class=fc,
            passenger=passenger,
            payment=payment,
            user=user
        )
        
        print(f'Created ticket: {ticket_num}')
    
    total = Ticket.objects.filter(user=user).count()
    print(f'Total tickets for user {user.username}: {total}')

if __name__ == "__main__":
    create_tickets()
