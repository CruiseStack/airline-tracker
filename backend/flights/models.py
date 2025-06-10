from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from accounts.models import CustomUser

class Airline(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)  # e.g., "TK" for Turkish Airlines
    country = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} ({self.code})"

class Airport(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)  # e.g., "IST" for Istanbul
    city = models.CharField(max_length=50)
    country = models.CharField(max_length=50)
    timezone = models.CharField(max_length=50, default='UTC')
    
    def __str__(self):
        return f"{self.name} ({self.code})"

class Flight(models.Model):
    FLIGHT_STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('boarding', 'Boarding'),
        ('departed', 'Departed'),
        ('in_air', 'In Air'),
        ('landed', 'Landed'),
        ('delayed', 'Delayed'),
        ('cancelled', 'Cancelled'),
    ]
    
    flight_number = models.CharField(max_length=20)
    airline = models.ForeignKey(Airline, on_delete=models.CASCADE)
    departure_airport = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name='departing_flights')
    arrival_airport = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name='arriving_flights')
    
    scheduled_departure = models.DateTimeField()
    scheduled_arrival = models.DateTimeField()
    actual_departure = models.DateTimeField(null=True, blank=True)
    actual_arrival = models.DateTimeField(null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=FLIGHT_STATUS_CHOICES, default='scheduled')
    aircraft_type = models.CharField(max_length=50, blank=True)
    gate = models.CharField(max_length=10, blank=True)
    terminal = models.CharField(max_length=10, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-scheduled_departure']
        unique_together = ['flight_number', 'scheduled_departure']
    
    def __str__(self):
        return f"{self.airline.code}{self.flight_number} - {self.departure_airport.code} to {self.arrival_airport.code}"

    @property
    def duration(self):
        if self.scheduled_departure and self.scheduled_arrival:
            duration = self.scheduled_arrival - self.scheduled_departure
            hours, remainder = divmod(duration.total_seconds(), 3600)
            minutes, _ = divmod(remainder, 60)
            return f"{int(hours)}h {int(minutes)}m"
        return None

class FlightBooking(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE)
    booking_reference = models.CharField(max_length=10, unique=True)
    seat_number = models.CharField(max_length=10, blank=True)
    booking_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.booking_reference} - {self.user.email}"
