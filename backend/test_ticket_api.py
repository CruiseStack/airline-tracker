#!/usr/bin/env python
import os
import django
import requests
import json

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airline_tracker.settings')
django.setup()

from accounts.models import CustomUser
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken

def test_ticket_api():
    # Get the first user
    user = CustomUser.objects.first()
    if not user:
        print("No users found!")
        return
    
    print(f"Testing with user: {user.username}")
    
    # Create JWT token for the user
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    
    # Test GET request to /api/tickets/
    print("\n--- Testing GET /api/tickets/ ---")
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get('http://localhost:8000/api/tickets/', headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data)} tickets")
            for ticket in data:
                print(f"  - Ticket {ticket.get('ticket_number')}: {ticket.get('flight_instance_details', {}).get('flight_number', 'N/A')}")
        else:
            print(f"Error: {response.status_code}")
            try:
                error_data = response.json()
                print(f"Error details: {error_data}")
            except:
                print(f"Raw error: {response.text}")
                
    except requests.exceptions.ConnectionError:
        print("Connection error - is the Django server running?")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_ticket_api()
