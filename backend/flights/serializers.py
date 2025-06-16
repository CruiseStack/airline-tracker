from rest_framework import serializers
from .models import (
    Country, City, Airport, Flight, FlightInstance, 
    Aircraft, FlightClass, Passenger, Ticket, Payment
)


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'


class CitySerializer(serializers.ModelSerializer):
    country_name = serializers.CharField(source='country.country_name', read_only=True)
    
    class Meta:
        model = City
        fields = ['city_id', 'city_name', 'country', 'country_name']


class AirportSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='city.city_name', read_only=True)
    country_name = serializers.CharField(source='city.country.country_name', read_only=True)
    
    class Meta:
        model = Airport
        fields = ['iata_code', 'name', 'service_fee', 'city', 'city_name', 'country_name']


class AircraftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aircraft
        fields = '__all__'


class FlightSerializer(serializers.ModelSerializer):
    origin_name = serializers.CharField(source='origin.name', read_only=True)
    destination_name = serializers.CharField(source='destination.name', read_only=True)
    origin_city = serializers.CharField(source='origin.city.city_name', read_only=True)
    destination_city = serializers.CharField(source='destination.city.city_name', read_only=True)
    
    class Meta:
        model = Flight
        fields = [
            'fnum', 'duration', 'origin', 'destination',
            'origin_name', 'destination_name', 'origin_city', 'destination_city'
        ]


class FlightInstanceSerializer(serializers.ModelSerializer):
    flight_details = FlightSerializer(source='flight', read_only=True)
    aircraft_details = AircraftSerializer(source='aircraft', read_only=True)
    
    class Meta:
        model = FlightInstance
        fields = [
            'flight', 'date', 'gate_number', 'price_base_multiplier',
            'aircraft', 'flight_details', 'aircraft_details'
        ]


class FlightSearchSerializer(serializers.Serializer):
    origin_city = serializers.CharField(required=False)
    destination_city = serializers.CharField(required=False)
    origin_airport = serializers.CharField(required=False)
    destination_airport = serializers.CharField(required=False)
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False)
    page = serializers.IntegerField(default=1)
    page_size = serializers.IntegerField(default=10)


class CitySearchSerializer(serializers.Serializer):
    search = serializers.CharField(max_length=100)


class AirportSearchSerializer(serializers.Serializer):
    search = serializers.CharField(max_length=100)
