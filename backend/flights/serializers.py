from rest_framework import serializers
from .models import Airline, Airport, Flight, FlightBooking

class AirlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airline
        fields = ['id', 'name', 'code', 'country']

class AirportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airport
        fields = ['id', 'name', 'code', 'city', 'country', 'timezone']

class FlightListSerializer(serializers.ModelSerializer):
    airline = AirlineSerializer(read_only=True)
    departure_airport = AirportSerializer(read_only=True)
    arrival_airport = AirportSerializer(read_only=True)
    duration = serializers.SerializerMethodField()
    
    class Meta:
        model = Flight
        fields = ['id', 'flight_number', 'airline', 'departure_airport', 'arrival_airport',
                 'scheduled_departure', 'scheduled_arrival', 'actual_departure', 'actual_arrival',
                 'status', 'gate', 'terminal', 'duration', 'price']
    
    def get_duration(self, obj):
        return obj.duration

class FlightDetailSerializer(serializers.ModelSerializer):
    airline = AirlineSerializer(read_only=True)
    departure_airport = AirportSerializer(read_only=True)
    arrival_airport = AirportSerializer(read_only=True)
    duration = serializers.SerializerMethodField()
    
    class Meta:
        model = Flight
        fields = '__all__'
    
    def get_duration(self, obj):
        return obj.duration
