from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
<<<<<<< HEAD
    path('api/', include('ticket.urls')),
=======
    path('api/', include('tickets.urls')),
    path('api/flights/', include('flights.urls')),
>>>>>>> 55bcb048e6c306ba17c4261b97953c903e355948
]
