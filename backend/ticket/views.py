from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .models import Ticket
from flights.models import Payment, FlightInstance, FlightClass, Passenger, Country
from .serializers import TicketSerializer, PaymentSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return tickets for the authenticated user
        return Ticket.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Get the total price from request data if provided
        total_price = self.request.data.get('total_price', 100.00)  # Default price
        paid_cash = self.request.data.get('paid_cash', total_price)  # Amount paid in cash
        paid_points = self.request.data.get('paid_points', 0)  # Points used
        
        # Create payment first - mark as paid since user went through payment process
        payment = Payment.objects.create(
            base_price=total_price,
            tax=total_price * 0.1,  # 10% tax
            total=total_price * 1.1,  # Base + tax
            paid_cash=paid_cash,  # Mark as paid
            paid_points=paid_points
        )
        
        # Create passenger if passenger data is provided
        passenger_data = self.request.data.get('passenger_data')
        if passenger_data:
            # Get or create a default country (you might want to make this dynamic)
            default_country, created = Country.objects.get_or_create(
                country_code='USA',
                defaults={
                    'country_name': 'United States',
                    'country_area_code': '+1'
                }
            )
            
            passenger = Passenger.objects.create(
                id_document=passenger_data.get('id_document', ''),
                id_type=passenger_data.get('id_type', 'passport'),
                id_number=passenger_data.get('id_number', ''),
                first_name=passenger_data.get('first_name', ''),
                last_name=passenger_data.get('last_name', ''),
                area_code=passenger_data.get('area_code', '+1'),
                phone_number=passenger_data.get('phone_number', ''),
                email=passenger_data.get('email', ''),
                birthdate=passenger_data.get('birthdate', '1990-01-01'),
                citizenship=default_country
            )
        else:
            # Create a passenger from user data as fallback
            passenger = Passenger.objects.create(
                id_document='N/A',
                id_type='passport',
                id_number='N/A',
                first_name=self.request.user.first_name or 'Unknown',
                last_name=self.request.user.last_name or 'User',
                area_code='+1',
                phone_number='',
                email=self.request.user.email,
                birthdate='1990-01-01',
                citizenship=Country.objects.get_or_create(
                    country_code='USA',
                    defaults={'country_name': 'United States', 'country_area_code': '+1'}
                )[0]
            )
        
        # Save ticket with payment, passenger, and user
        serializer.save(user=self.request.user, payment=payment, passenger=passenger)
    
    def create(self, request, *args, **kwargs):
        # Add debugging for create requests
        print(f"CREATE request data: {request.data}")
        print(f"User: {request.user}")
        return super().create(request, *args, **kwargs)
    
    def list(self, request, *args, **kwargs):
        # Add debugging for list requests
        print(f"LIST request from user: {request.user}")
        queryset = self.get_queryset()
        print(f"Found {queryset.count()} tickets")
        return super().list(request, *args, **kwargs)

    @action(detail=True, methods=['post'], url_path='pay')
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
