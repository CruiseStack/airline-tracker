from django.db import models

class Passenger(models.Model):
    id_type = models.CharField(max_length=20)
    id_number = models.CharField(max_length=50)
    id_document = models.TextField()
    
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    
    area_code = models.CharField(max_length=10)
    phone_number = models.CharField(max_length=15)
    telephone = models.CharField(max_length=20)
    email = models.EmailField()
    
    passenger_id = models.CharField(max_length=20, unique=True)
    birthdate = models.DateField()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"