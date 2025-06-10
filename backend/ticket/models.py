from django.db import models

class Payment(models.Model):
    payment_number = models.AutoField(primary_key=True)
    tax = models.DecimalField(max_digits=10, decimal_places=2)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    paid_cash = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    paid_points = models.IntegerField(default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Payment #{self.payment_number}"


class Ticket(models.Model):
    ticket_number = models.AutoField(primary_key=True)
    PNR_number = models.CharField(max_length=20, unique=True)
    ticketing_timestamp = models.DateTimeField(auto_now_add=True)
    checkin_status = models.BooleanField(default=False)
    seat_number = models.CharField(max_length=5)
    gate_number = models.CharField(max_length=5)

    class_type = models.CharField(max_length=10, choices=[('ECONOMY', 'Economy'), ('BUSINESS', 'Business')])
    carry_on = models.BooleanField(default=True)
    baggage = models.IntegerField(default=0)
    extra_baggage = models.IntegerField(default=0)

    passenger = models.ForeignKey('passenger.Passenger', on_delete=models.CASCADE, related_name='tickets')
    flight_instance = models.ForeignKey('flight.FlightInstance', on_delete=models.CASCADE, related_name='tickets')
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='tickets')

    def __str__(self):
        return f"Ticket #{self.ticket_number} - {self.PNR_number}"