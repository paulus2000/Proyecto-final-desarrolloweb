from django.db import models
from django.conf import settings


class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    date = models.DateTimeField()
    location = models.CharField(max_length=200, blank=True)
    capacity = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    # Who created this event (optional). Use SET_NULL so events remain if user is removed.
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='created_events')
    # Whether we already sent the "event started" notifications to registered users
    notification_sent = models.BooleanField(default=False)

    def tickets_sold(self):
        return self.registrations.filter(canceled=False).count()

    def seats_available(self):
        return max(self.capacity - self.tickets_sold(), 0)

    def __str__(self):
        return self.title


class Registration(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='registrations')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
    canceled = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'event')

    def __str__(self):
        return f"{self.user} -> {self.event}"
from django.db import models

# Create your models here.
