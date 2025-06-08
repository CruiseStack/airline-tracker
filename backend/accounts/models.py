from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phone_number = models.CharField(max_length=15, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return self.email
class Ticket(models.Model):
    ticket_number = models.AutoField(primary_key=True)
    PNR_number = models.CharField(max_length=20, unique=True)
    ticketing_timestamp = models.DateTimeField(default=timezone.now)
    checkin_status = models.BooleanField(default=False)
    seat_number = models.CharField(max_length=5)
    gate_number = models.CharField(max_length=5)

    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE, related_name="tickets")
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name="tickets")
    flight_instance = models.ForeignKey(FlightInstance, on_delete=models.CASCADE, related_name="tickets")

    FLIGHT_CLASS_CHOICES = [
        ('ECONOMY', 'Economy'),
        ('BUSINESS', 'Business'),
    ]
    class_type = models.CharField(max_length=10, choices=FLIGHT_CLASS_CHOICES)
    carry_on = models.BooleanField(default=True)
    baggage = models.IntegerField(default=0)
    extra_baggage = models.IntegerField(default=0)

    def __str__(self):
        return f"Ticket #{self.ticket_number} - PNR {self.PNR_number}"