from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .models import Ticket
from .serializers import TicketSerializer, PaymentSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return tickets for the authenticated user
        return Ticket.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='pay')
    def pay_ticket(self, request, pk=None):
        ticket = self.get_object()
        if ticket.is_paid:
            return Response({'detail': 'Ticket already paid.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = PaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        ticket.paid_cash = serializer.validated_data['paid_cash']
        ticket.paid_points = serializer.validated_data['paid_points']
        ticket.is_paid = True
        ticket.save()

        return Response({'status': 'payment successful', 'ticket': TicketSerializer(ticket).data})
