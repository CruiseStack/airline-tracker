from rest_framework import serializers
from .models import Ticket

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'

class PaymentSerializer(serializers.Serializer):
    paid_cash = serializers.DecimalField(max_digits=8, decimal_places=2)
    paid_points = serializers.IntegerField()
    total = serializers.DecimalField(max_digits=8, decimal_places=2)
