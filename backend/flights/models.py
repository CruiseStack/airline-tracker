from django.db import models
from accounts.models import CustomUser


class Country(models.Model):
    country_code = models.CharField(max_length=3, primary_key=True)
    country_name = models.CharField(max_length=100)
    country_area_code = models.CharField(max_length=5)

    def __str__(self):
        return f"{self.country_name} ({self.country_code})"


class City(models.Model):
    city_id = models.AutoField(primary_key=True)
    city_name = models.CharField(max_length=100)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='cities')

    def __str__(self):
        return f"{self.city_name}, {self.country.country_name}"


class Airport(models.Model):
    iata_code = models.CharField(max_length=3, primary_key=True)
    name = models.CharField(max_length=200)
    service_fee = models.DecimalField(max_digits=10, decimal_places=2)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='airports')

    def __str__(self):
        return f"{self.name} ({self.iata_code})"


class DiscountMultiplier(models.Model):
    discount_type = models.CharField(max_length=50, primary_key=True)
    discount_coefficient = models.DecimalField(max_digits=5, decimal_places=4)

    def __str__(self):
        return f"{self.discount_type} ({self.discount_coefficient})"


class Passenger(models.Model):
    ID_TYPE_CHOICES = [
        ('passport', 'Passport'),
        ('national_id', 'National ID'),
        ('driving_license', 'Driving License'),
    ]
    
    passenger_id = models.AutoField(primary_key=True)
    id_document = models.CharField(max_length=50)
    id_type = models.CharField(max_length=20, choices=ID_TYPE_CHOICES)
    id_number = models.CharField(max_length=50)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    area_code = models.CharField(max_length=5)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField()
    birthdate = models.DateField()
    citizenship = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='citizens')
    discount = models.ForeignKey(DiscountMultiplier, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Guest(models.Model):
    passenger = models.OneToOneField(Passenger, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return f"Guest: {self.passenger}"


class FrequentTraveler(models.Model):
    passenger = models.OneToOneField(Passenger, on_delete=models.CASCADE, primary_key=True)
    FQTV_id = models.CharField(max_length=20, unique=True)
    password = models.CharField(max_length=128)
    points = models.IntegerField(default=0)

    def __str__(self):
        return f"Frequent Traveler: {self.passenger} (ID: {self.FQTV_id})"


class Aircraft(models.Model):
    aircraft_id = models.AutoField(primary_key=True)
    register = models.CharField(max_length=20, unique=True)
    model = models.CharField(max_length=50)
    seats_business = models.IntegerField()
    seats_economy = models.IntegerField()

    def __str__(self):
        return f"{self.model} ({self.register})"


class Flight(models.Model):
    fnum = models.CharField(max_length=10, primary_key=True)
    duration = models.DurationField()
    origin = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name='origin_flights')
    destination = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name='destination_flights')

    def __str__(self):
        return f"Flight {self.fnum}: {self.origin.iata_code} → {self.destination.iata_code}"


class FlightInstance(models.Model):
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE, related_name='instances')
    date = models.DateField()
    gate_number = models.CharField(max_length=10)
    price_base_multiplier = models.DecimalField(max_digits=5, decimal_places=4)
    aircraft = models.ForeignKey(Aircraft, on_delete=models.CASCADE, related_name='flight_instances')

    class Meta:
        unique_together = ('flight', 'date')

    def __str__(self):
        return f"{self.flight.fnum} on {self.date}"


class FlightClass(models.Model):
    class_type = models.CharField(max_length=20, primary_key=True)
    baggage = models.IntegerField()  # in kg
    carry_on = models.IntegerField()  # in kg

    def __str__(self):
        return self.class_type


class Payment(models.Model):
    payment_number = models.AutoField(primary_key=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    paid_cash = models.DecimalField(max_digits=10, decimal_places=2)
    paid_points = models.IntegerField(default=0)

    def __str__(self):
        return f"Payment {self.payment_number}: ${self.total}"


class Ticket(models.Model):
    CHECKIN_STATUS_CHOICES = [
        ('not_checked_in', 'Not Checked In'),
        ('checked_in', 'Checked In'),
        ('boarded', 'Boarded'),
    ]
    
    ticket_number = models.CharField(max_length=20, primary_key=True)
    PNR_number = models.CharField(max_length=10)
    checkin_status = models.CharField(max_length=20, choices=CHECKIN_STATUS_CHOICES, default='not_checked_in')
    seat_number = models.CharField(max_length=5)
    extra_baggage = models.IntegerField(default=0)  # in kg
    ticketing_timestamp = models.DateTimeField(auto_now_add=True)
    flight_instance = models.ForeignKey(FlightInstance, on_delete=models.CASCADE, related_name='tickets')
    flight_class = models.ForeignKey(FlightClass, on_delete=models.CASCADE, related_name='tickets')
    passengers = models.ManyToManyField(Passenger, related_name='tickets')
    payment = models.OneToOneField(Payment, on_delete=models.CASCADE, related_name='ticket')

    def __str__(self):
        return f"Ticket {self.ticket_number} - {self.flight_instance}"


class CaregiverInfant(models.Model):
    caregiver = models.ForeignKey(Passenger, on_delete=models.CASCADE, related_name='infants')
    infant = models.ForeignKey(Passenger, on_delete=models.CASCADE, related_name='caregivers')

    class Meta:
        unique_together = ('caregiver', 'infant')

    def __str__(self):
        return f"{self.caregiver} caring for {self.infant}"
