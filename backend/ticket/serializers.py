# backend/ticket/serializers.py
from rest_framework import serializers
from .models import Ticket, Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class TicketSerializer(serializers.ModelSerializer):
    payment = PaymentSerializer(read_only=True)

    class Meta:
        model = Ticket
        fields = '__all__'