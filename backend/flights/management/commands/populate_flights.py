from django.core.management.base import BaseCommand
from flights.models import *
from datetime import datetime, timedelta, date
import random


class Command(BaseCommand):
    help = 'Populate database with sample flight data'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')
        
        # Create countries
        countries = [
            {'country_code': 'USA', 'country_name': 'United States', 'country_area_code': '+1'},
            {'country_code': 'UK', 'country_name': 'United Kingdom', 'country_area_code': '+44'},
            {'country_code': 'FR', 'country_name': 'France', 'country_area_code': '+33'},
            {'country_code': 'DE', 'country_name': 'Germany', 'country_area_code': '+49'},
            {'country_code': 'JP', 'country_name': 'Japan', 'country_area_code': '+81'},
            {'country_code': 'AU', 'country_name': 'Australia', 'country_area_code': '+61'},
            {'country_code': 'CA', 'country_name': 'Canada', 'country_area_code': '+1'},
            {'country_code': 'BR', 'country_name': 'Brazil', 'country_area_code': '+55'},
            {'country_code': 'TR', 'country_name': 'Turkey', 'country_area_code': '+90'},
            {'country_code': 'ES', 'country_name': 'Spain', 'country_area_code': '+34'},
        ]
        
        for country_data in countries:
            Country.objects.get_or_create(**country_data)
        
        # Create cities
        cities = [
            {'city_name': 'New York', 'country_id': 'USA'},
            {'city_name': 'Los Angeles', 'country_id': 'USA'},
            {'city_name': 'Chicago', 'country_id': 'USA'},
            {'city_name': 'London', 'country_id': 'UK'},
            {'city_name': 'Manchester', 'country_id': 'UK'},
            {'city_name': 'Paris', 'country_id': 'FR'},
            {'city_name': 'Lyon', 'country_id': 'FR'},
            {'city_name': 'Berlin', 'country_id': 'DE'},
            {'city_name': 'Munich', 'country_id': 'DE'},
            {'city_name': 'Tokyo', 'country_id': 'JP'},
            {'city_name': 'Osaka', 'country_id': 'JP'},
            {'city_name': 'Sydney', 'country_id': 'AU'},
            {'city_name': 'Melbourne', 'country_id': 'AU'},
            {'city_name': 'Toronto', 'country_id': 'CA'},
            {'city_name': 'Vancouver', 'country_id': 'CA'},
            {'city_name': 'São Paulo', 'country_id': 'BR'},
            {'city_name': 'Rio de Janeiro', 'country_id': 'BR'},
            {'city_name': 'Istanbul', 'country_id': 'TR'},
            {'city_name': 'Ankara', 'country_id': 'TR'},
            {'city_name': 'Madrid', 'country_id': 'ES'},
            {'city_name': 'Barcelona', 'country_id': 'ES'},
        ]
        
        for city_data in cities:
            country = Country.objects.get(country_code=city_data['country_id'])
            City.objects.get_or_create(
                city_name=city_data['city_name'],
                country=country
            )
        
        # Create airports
        airports = [
            {'iata_code': 'JFK', 'name': 'John F. Kennedy International Airport', 'city_name': 'New York', 'service_fee': 25.00},
            {'iata_code': 'LAX', 'name': 'Los Angeles International Airport', 'city_name': 'Los Angeles', 'service_fee': 30.00},
            {'iata_code': 'ORD', 'name': 'Chicago O\'Hare International Airport', 'city_name': 'Chicago', 'service_fee': 20.00},
            {'iata_code': 'LHR', 'name': 'London Heathrow Airport', 'city_name': 'London', 'service_fee': 35.00},
            {'iata_code': 'MAN', 'name': 'Manchester Airport', 'city_name': 'Manchester', 'service_fee': 25.00},
            {'iata_code': 'CDG', 'name': 'Charles de Gaulle Airport', 'city_name': 'Paris', 'service_fee': 40.00},
            {'iata_code': 'LYS', 'name': 'Lyon-Saint Exupéry Airport', 'city_name': 'Lyon', 'service_fee': 30.00},
            {'iata_code': 'BER', 'name': 'Berlin Brandenburg Airport', 'city_name': 'Berlin', 'service_fee': 28.00},
            {'iata_code': 'MUC', 'name': 'Munich Airport', 'city_name': 'Munich', 'service_fee': 32.00},
            {'iata_code': 'NRT', 'name': 'Narita International Airport', 'city_name': 'Tokyo', 'service_fee': 45.00},
            {'iata_code': 'KIX', 'name': 'Kansai International Airport', 'city_name': 'Osaka', 'service_fee': 40.00},
            {'iata_code': 'SYD', 'name': 'Sydney Kingsford Smith Airport', 'city_name': 'Sydney', 'service_fee': 35.00},
            {'iata_code': 'MEL', 'name': 'Melbourne Airport', 'city_name': 'Melbourne', 'service_fee': 30.00},
            {'iata_code': 'YYZ', 'name': 'Toronto Pearson International Airport', 'city_name': 'Toronto', 'service_fee': 25.00},
            {'iata_code': 'YVR', 'name': 'Vancouver International Airport', 'city_name': 'Vancouver', 'service_fee': 28.00},
            {'iata_code': 'GRU', 'name': 'São Paulo-Guarulhos International Airport', 'city_name': 'São Paulo', 'service_fee': 22.00},
            {'iata_code': 'GIG', 'name': 'Rio de Janeiro-Galeão International Airport', 'city_name': 'Rio de Janeiro', 'service_fee': 20.00},
            {'iata_code': 'IST', 'name': 'Istanbul Airport', 'city_name': 'Istanbul', 'service_fee': 18.00},
            {'iata_code': 'ESB', 'name': 'Esenboğa Airport', 'city_name': 'Ankara', 'service_fee': 15.00},
            {'iata_code': 'MAD', 'name': 'Madrid-Barajas Airport', 'city_name': 'Madrid', 'service_fee': 30.00},
            {'iata_code': 'BCN', 'name': 'Barcelona-El Prat Airport', 'city_name': 'Barcelona', 'service_fee': 28.00},
        ]
        
        for airport_data in airports:
            city = City.objects.get(city_name=airport_data['city_name'])
            Airport.objects.get_or_create(
                iata_code=airport_data['iata_code'],
                defaults={
                    'name': airport_data['name'],
                    'service_fee': airport_data['service_fee'],
                    'city': city
                }
            )
        
        # Create flight classes
        flight_classes = [
            {'class_type': 'Economy', 'baggage': 23, 'carry_on': 7},
            {'class_type': 'Business', 'baggage': 32, 'carry_on': 10},
            {'class_type': 'First', 'baggage': 32, 'carry_on': 15},
        ]
        
        for fc_data in flight_classes:
            FlightClass.objects.get_or_create(**fc_data)
        
        # Create discount multipliers
        discounts = [
            {'discount_type': 'Student', 'discount_coefficient': 0.85},
            {'discount_type': 'Senior', 'discount_coefficient': 0.80},
            {'discount_type': 'Military', 'discount_coefficient': 0.75},
            {'discount_type': 'Regular', 'discount_coefficient': 1.00},
        ]
        
        for discount_data in discounts:
            DiscountMultiplier.objects.get_or_create(**discount_data)
        
        # Create aircraft
        aircraft_models = [
            {'register': 'N123AA', 'model': 'Boeing 737-800', 'seats_business': 16, 'seats_economy': 144},
            {'register': 'N456BB', 'model': 'Airbus A320', 'seats_business': 12, 'seats_economy': 138},
            {'register': 'N789CC', 'model': 'Boeing 777-300ER', 'seats_business': 42, 'seats_economy': 266},
            {'register': 'N012DD', 'model': 'Airbus A330-300', 'seats_business': 36, 'seats_economy': 251},
            {'register': 'N345EE', 'model': 'Boeing 787-9', 'seats_business': 30, 'seats_economy': 246},
            {'register': 'N678FF', 'model': 'Airbus A350-900', 'seats_business': 42, 'seats_economy': 253},
            {'register': 'N901GG', 'model': 'Boeing 747-8', 'seats_business': 58, 'seats_economy': 346},
            {'register': 'N234HH', 'model': 'Airbus A380', 'seats_business': 76, 'seats_economy': 427},
        ]
        
        for aircraft_data in aircraft_models:
            Aircraft.objects.get_or_create(**aircraft_data)
        
        # Create flights
        airports_list = list(Airport.objects.all())
        aircraft_list = list(Aircraft.objects.all())
        
        flight_routes = [
            ('JFK', 'LHR'), ('LHR', 'JFK'), ('LAX', 'NRT'), ('NRT', 'LAX'),
            ('ORD', 'CDG'), ('CDG', 'ORD'), ('SYD', 'LAX'), ('LAX', 'SYD'),
            ('YYZ', 'LHR'), ('LHR', 'YYZ'), ('IST', 'JFK'), ('JFK', 'IST'),
            ('MAD', 'GRU'), ('GRU', 'MAD'), ('BER', 'MUC'), ('MUC', 'BER'),
            ('BCN', 'CDG'), ('CDG', 'BCN'), ('MEL', 'SYD'), ('SYD', 'MEL'),
            ('YVR', 'NRT'), ('NRT', 'YVR'), ('GIG', 'MAD'), ('MAD', 'GIG'),
            ('ESB', 'IST'), ('IST', 'ESB'), ('KIX', 'SYD'), ('SYD', 'KIX'),
            ('MAN', 'ORD'), ('ORD', 'MAN'), ('LYS', 'BER'), ('BER', 'LYS'),
        ]
        
        flight_number = 1000
        for origin_code, dest_code in flight_routes:
            origin = Airport.objects.get(iata_code=origin_code)
            destination = Airport.objects.get(iata_code=dest_code)
            
            # Calculate approximate flight duration (simplified)
            duration_hours = random.randint(2, 16)
            duration_minutes = random.randint(0, 59)
            duration = timedelta(hours=duration_hours, minutes=duration_minutes)
            
            flight = Flight.objects.get_or_create(
                fnum=f'FL{flight_number}',
                defaults={
                    'duration': duration,
                    'origin': origin,
                    'destination': destination
                }
            )[0]
            
            # Create flight instances for the next 30 days
            start_date = date.today()
            for i in range(30):
                flight_date = start_date + timedelta(days=i)
                aircraft = random.choice(aircraft_list)
                
                FlightInstance.objects.get_or_create(
                    flight=flight,
                    date=flight_date,
                    defaults={
                        'gate_number': f'A{random.randint(1, 50)}',
                        'price_base_multiplier': round(random.uniform(0.8, 1.5), 4),
                        'aircraft': aircraft
                    }
                )
            
            flight_number += 1
        
        self.stdout.write(
            self.style.SUCCESS('Successfully created sample flight data!')
        )
