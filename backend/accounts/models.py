from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


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

class Passenger(models.Model):
    passenger_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    id_document = models.CharField(max_length=100)
    id_type = models.CharField(max_length=50)
    birthdate = models.DateField()
    email = models.EmailField()
    telephone = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class FlightInstance(models.Model):
    # Assuming FlightInstance is defined in flight/models.py and imported here
    # Placeholder fields
    instance_id = models.AutoField(primary_key=True)
    # Other fields can be added as per your schema

    def __str__(self):
        return f"FlightInstance #{self.instance_id}"
class Payment(models.Model):
    payment_number = models.AutoField(primary_key=True)
    tax = models.DecimalField(max_digits=10, decimal_places=2)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    paid_cash = models.DecimalField(max_digits=10, decimal_places=2)
    paid_points = models.IntegerField()
    total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Payment #{self.payment_number}"
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