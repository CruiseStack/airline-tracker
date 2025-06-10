# backend/ticket/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Ticket
from .serializers import TicketSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Ticket.objects.all()
        return Ticket.objects.filter(passenger__user=user)

    @action(detail=True, methods=['post'], url_path='pay')
    def pay(self, request, pk=None):
        ticket = self.get_object()
        method = request.data.get('method', 'cash')

        if method not in ['cash', 'points']:
            return Response({'error': 'Invalid payment method'}, status=400)

        if ticket.checkin_status:
            return Response({'error': 'Already paid or checked in.'}, status=400)

        payment = ticket.payment

        if method == 'cash':
            payment.paid_cash = payment.total
            payment.paid_points = 0
        elif method == 'points':
            passenger = ticket.passenger
            ft = getattr(passenger, 'frequent_traveler', None)
            if not ft or ft.points < int(payment.total):
                return Response({'error': 'Insufficient points.'}, status=400)
            ft.points -= int(payment.total)
            ft.save()
            payment.paid_points = int(payment.total)
            payment.paid_cash = 0

        payment.save()
        ticket.checkin_status = True
        ticket.save()
        return Response({'message': 'Payment successful.'})

    @action(detail=True, methods=['post'], url_path='checkin')
    def checkin(self, request, pk=None):
        ticket = self.get_object()
        if not ticket.checkin_status:
            ticket.checkin_status = True
            ticket.save()
            return Response({'message': 'Checked in successfully.'})
        return Response({'error': 'Already checked in.'}, status=400)

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel(self, request, pk=None):
        ticket = self.get_object()
        if ticket.checkin_status:
            return Response({'error': 'Cannot cancel after check-in.'}, status=400)
        ticket.delete()
        return Response({'message': 'Ticket canceled.'}, status = 204)