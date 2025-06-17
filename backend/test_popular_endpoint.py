#!/usr/bin/env python
import os
import django
import requests

# Setup Django (for any model imports if needed)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airline_tracker.settings')
django.setup()

try:
    response = requests.get('http://localhost:8000/api/flights/popular-destination-flight/')
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
