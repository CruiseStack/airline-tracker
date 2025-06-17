from rest_framework import serializers
from .models import Ticket
from flights.models import Payment, FlightInstance, FlightClass, Passenger

class TicketSerializer(serializers.ModelSerializer):
    flight_instance_details = serializers.SerializerMethodField()
    flight_class_details = serializers.SerializerMethodField()
    payment_details = serializers.SerializerMethodField()
    passenger_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Ticket
        fields = [
            'ticket_number', 'PNR_number', 'checkin_status', 'seat_number',
            'extra_baggage', 'ticketing_timestamp', 'flight_instance',
            'flight_class', 'payment', 'user', 'flight_instance_details',
            'flight_class_details', 'payment_details', 'passenger_details'
        ]
        
    def get_flight_instance_details(self, obj):
        if obj.flight_instance:
            return {
                'flight_number': obj.flight_instance.flight.fnum,
                'date': obj.flight_instance.date,
                'origin': obj.flight_instance.flight.origin.name,
                'destination': obj.flight_instance.flight.destination.name,
                'gate': obj.flight_instance.gate_number,
                'aircraft': obj.flight_instance.aircraft.model
            }
        return None
    
    def get_flight_class_details(self, obj):
        if obj.flight_class:
            return {
                'class_type': obj.flight_class.class_type,
                'baggage': obj.flight_class.baggage,
                'carry_on': obj.flight_class.carry_on
            }
        return None
    
    def get_payment_details(self, obj):
        if obj.payment:
            return {
                'payment_number': obj.payment.payment_number,
                'total': str(obj.payment.total),
                'paid_cash': str(obj.payment.paid_cash),
                'paid_points': obj.payment.paid_points,                'is_paid': obj.payment.paid_cash > 0 or obj.payment.paid_points > 0
            }
        return None
    
    def get_passenger_details(self, obj):
        if obj.passenger:
            return {
                'first_name': obj.passenger.first_name,
                'last_name': obj.passenger.last_name,
                'email': obj.passenger.email
            }
        return None

class PaymentSerializer(serializers.Serializer):
    paid_cash = serializers.DecimalField(max_digits=10, decimal_places=2)
    paid_points = serializers.IntegerField()
    total = serializers.DecimalField(max_digits=10, decimal_places=2)
