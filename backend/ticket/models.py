from django.db import models
from django.conf import settings
from flights.models import FlightInstance, FlightClass, Payment, Passenger

class Ticket(models.Model):
    CHECKIN_STATUS_CHOICES = [
        ('not_checked_in', 'Not Checked In'),
        ('checked_in', 'Checked In'),
        ('boarded', 'Boarded'),
    ]
    
    ticket_number = models.CharField(max_length=20, primary_key=True)
    PNR_number = models.CharField(max_length=20)
    checkin_status = models.CharField(max_length=20, choices=CHECKIN_STATUS_CHOICES, default='not_checked_in')
    seat_number = models.CharField(max_length=10)
    extra_baggage = models.BooleanField(default=False)
    ticketing_timestamp = models.DateTimeField(auto_now_add=True)
      # Foreign key relationships
    flight_instance = models.ForeignKey(FlightInstance, on_delete=models.CASCADE, related_name='tickets')
    flight_class = models.ForeignKey(FlightClass, on_delete=models.CASCADE, related_name='tickets')
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='ticket', null=True, blank=True)
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE, related_name='tickets', null=True, blank=True)
    
    # User who booked the ticket (may be different from passenger)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='booked_tickets')

    def __str__(self):
        passenger_name = f"{self.passenger.first_name} {self.passenger.last_name}" if self.passenger else "No passenger"
        return f"Ticket {self.ticket_number} - {self.flight_instance} - {passenger_name}"
