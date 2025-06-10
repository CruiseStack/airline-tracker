#!/usr/bin/env python
"""
Database setup script for AirTracker Airline Management System
"""
import os
import sys
import django
from pathlib import Path

def setup_django():
    """Setup Django environment"""
    # Add the backend directory to Python path
    backend_dir = Path(__file__).parent
    sys.path.insert(0, str(backend_dir))
    
    # Set Django settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airline_tracker.settings')
    django.setup()

def create_migrations():
    """Create database migrations"""
    from django.core.management import execute_from_command_line
    
    print("Creating migrations for accounts app...")
    execute_from_command_line(['manage.py', 'makemigrations', 'accounts'])
    
    print("Creating migrations for flights app...")
    execute_from_command_line(['manage.py', 'makemigrations', 'flights'])
    
    print("Creating migrations for all apps...")
    execute_from_command_line(['manage.py', 'makemigrations'])

def run_migrations():
    """Apply database migrations"""
    from django.core.management import execute_from_command_line
    
    print("Applying migrations...")
    execute_from_command_line(['manage.py', 'migrate'])

def create_superuser():
    """Create Django superuser"""
    from django.core.management import execute_from_command_line
    
    print("Creating superuser...")
    execute_from_command_line(['manage.py', 'createsuperuser'])

def main():
    """Main setup function"""
    print("=== AirTracker Database Setup ===")
    print("This script will set up your database for the AirTracker application.")
    print()
    
    # Setup Django
    setup_django()
    
    # Check database connection
    from django.db import connection
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        print("✓ Database connection successful")
    except Exception as e:
        print(f"✗ Database connection failed: {e}")
        print("Please check your database configuration in .env file")
        return
    
    # Create and run migrations
    try:
        create_migrations()
        print("✓ Migrations created successfully")
    except Exception as e:
        print(f"✗ Error creating migrations: {e}")
        return
    
    try:
        run_migrations()
        print("✓ Migrations applied successfully")
    except Exception as e:
        print(f"✗ Error applying migrations: {e}")
        return
    
    # Ask if user wants to create superuser
    response = input("Would you like to create a superuser account? (y/n): ")
    if response.lower() in ['y', 'yes']:
        try:
            create_superuser()
            print("✓ Superuser created successfully")
        except Exception as e:
            print(f"✗ Error creating superuser: {e}")
    
    print()
    print("=== Database Setup Complete ===")
    print("Your AirTracker database is ready!")
    print("You can now run: python manage.py runserver")

if __name__ == '__main__':
    main()
