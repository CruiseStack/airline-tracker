from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .models import Ticket
from flights.models import Payment, FlightInstance, FlightClass, Passenger
from .serializers import TicketSerializer, PaymentSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return tickets for the authenticated user
        return Ticket.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)    @action(detail=True, methods=['post'], url_path='pay')
    def pay_ticket(self, request, pk=None):
        ticket = self.get_object()
        
        # Check if payment exists and is already completed
        if ticket.payment and (ticket.payment.paid_cash > 0 or ticket.payment.paid_points > 0):
            return Response({'detail': 'Ticket already paid.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = PaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Update or create payment
        if ticket.payment:
            ticket.payment.paid_cash = serializer.validated_data['paid_cash']
            ticket.payment.paid_points = serializer.validated_data['paid_points']
            ticket.payment.total = serializer.validated_data['total']
            ticket.payment.save()
        else:
            # Create new payment if doesn't exist
            payment = Payment.objects.create(
                base_price=serializer.validated_data['total'],
                tax=0,  # You can calculate tax here
                total=serializer.validated_data['total'],
                paid_cash=serializer.validated_data['paid_cash'],
                paid_points=serializer.validated_data['paid_points']
            )
            ticket.payment = payment
            ticket.save()

        return Response({'status': 'payment successful', 'ticket': TicketSerializer(ticket).data})
