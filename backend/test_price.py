#!/usr/bin/env python
import os
import django
import sys

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airline_tracker.settings')
django.setup()

from flights.models import FlightInstance

def test_price_calculation():
    instance = FlightInstance.objects.first()
    print(f"Instance: {instance}")
    
    if instance:
        print(f"Duration: {instance.flight.duration}")
        print(f"Duration type: {type(instance.flight.duration)}")
        print(f"Price multiplier: {instance.price_base_multiplier}")
        print(f"Price multiplier type: {type(instance.price_base_multiplier)}")
        
        try:
            price = instance.calculate_price()
            print(f"Price: {price}")
        except Exception as e:
            print(f"Error: {e}")
            import traceback
            traceback.print_exc()
    else:
        print("No flight instances found")

if __name__ == "__main__":
    test_price_calculation()
