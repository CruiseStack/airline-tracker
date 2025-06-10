from django.contrib import admin
from .models import Airline, Airport, Flight, FlightBooking

@admin.register(Airline)
class AirlineAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'country', 'created_at')
    list_filter = ('country',)
    search_fields = ('name', 'code')
    ordering = ('name',)

@admin.register(Airport)
class AirportAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'city', 'country')
    list_filter = ('country', 'city')
    search_fields = ('name', 'code', 'city')
    ordering = ('name',)

@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):
    list_display = ('flight_number', 'airline', 'departure_airport', 'arrival_airport', 
                   'scheduled_departure', 'status', 'price')
    list_filter = ('status', 'airline', 'departure_airport', 'arrival_airport', 'scheduled_departure')
    search_fields = ('flight_number', 'airline__name', 'departure_airport__code', 'arrival_airport__code')
    ordering = ('-scheduled_departure',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Flight Info', {
            'fields': ('flight_number', 'airline', 'aircraft_type', 'price')
        }),
        ('Route', {
            'fields': ('departure_airport', 'arrival_airport')
        }),
        ('Schedule', {
            'fields': ('scheduled_departure', 'scheduled_arrival', 'actual_departure', 'actual_arrival')
        }),
        ('Status & Gate', {
            'fields': ('status', 'gate', 'terminal')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(FlightBooking)
class FlightBookingAdmin(admin.ModelAdmin):
    list_display = ('booking_reference', 'user', 'flight', 'seat_number', 'booking_date')
    list_filter = ('booking_date', 'flight__airline')
    search_fields = ('booking_reference', 'user__email', 'flight__flight_number')
    ordering = ('-booking_date',)
