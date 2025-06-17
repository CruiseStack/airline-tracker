#!/usr/bin/env python
import os
import django
import sys
from datetime import date, datetime, timedelta
from decimal import Decimal

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airline_tracker.settings')
django.setup()

from ticket.models import Ticket
from flights.models import (
    Payment, FlightInstance, FlightClass, Passenger, 
    Flight, Airport, Aircraft, Country, City
)
from accounts.models import CustomUser

def create_test_data():
    print("Creating test data...")
    
    # Get the existing user
    user = CustomUser.objects.first()
    if not user:
        print("No users found. Please create a user first.")
        return
    
    print(f"Using user: {user.username}")
    
    # Check if we have flight data
    flight_instances = FlightInstance.objects.all()[:3]
    if not flight_instances:
        print("No flight instances found. Please run database setup first.")
        return
    
    # Check if we have flight classes
    flight_classes = FlightClass.objects.all()
    if not flight_classes:
        print("Creating flight classes...")
        FlightClass.objects.create(class_type='Economy', baggage=20, carry_on=8)
        FlightClass.objects.create(class_type='Business', baggage=30, carry_on=10)
        FlightClass.objects.create(class_type='First', baggage=40, carry_on=12)
        flight_classes = FlightClass.objects.all()
    
    # Get passengers or create a test passenger
    passengers = Passenger.objects.all()[:1]
    if not passengers:
        print("Creating test passenger...")
        # Get a country
        country = Country.objects.first()
        if not country:
            country = Country.objects.create(
                country_code='USA',
                country_name='United States',
                country_area_code='+1'
            )
        
        passenger = Passenger.objects.create(
            id_document='P123456789',
            id_type='passport',
            id_number='123456789',
            first_name='John',
            last_name='Doe',
            area_code='555',
            phone_number='1234567',
            email='john.doe@example.com',
            birthdate=date(1990, 1, 1),
            citizenship=country
        )
        passengers = [passenger]
    
    # Create test tickets
    for i, flight_instance in enumerate(flight_instances):
        ticket_number = f"TK{1000 + i}"
        
        # Check if ticket already exists
        if Ticket.objects.filter(ticket_number=ticket_number).exists():
            print(f"Ticket {ticket_number} already exists, skipping...")
            continue
        
        print(f"Creating ticket {ticket_number}...")
        
        # Create payment
        price = flight_instance.calculate_price('Economy')
        payment = Payment.objects.create(
            base_price=price,
            tax=price * Decimal('0.08'),  # 8% tax
            total=price * Decimal('1.08'),
            paid_cash=price * Decimal('1.08') if i % 2 == 0 else Decimal('0'),
            paid_points=0 if i % 2 == 0 else int(price * 100)  # Convert to points
        )
          # Create ticket
        ticket = Ticket.objects.create(
            ticket_number=ticket_number,
            PNR_number=f"PNR{1000 + i}",
            checkin_status='not_checked_in',
            seat_number=f"{i+1}A",
            extra_baggage=False,
            flight_instance=flight_instance,
            flight_class=flight_classes[i % len(flight_classes)],
            payment=payment,
            passenger=passengers[0],  # Use single passenger field
            user=user
        )
        
        print(f"Created ticket {ticket_number} for user {user.username}")
    
    print(f"Total tickets created for user {user.username}: {Ticket.objects.filter(user=user).count()}")

if __name__ == "__main__":
    create_test_data()
