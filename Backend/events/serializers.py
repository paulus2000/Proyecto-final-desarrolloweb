from rest_framework import serializers
from .models import Event, Registration
from django.contrib.auth import get_user_model

User = get_user_model()


class EventSerializer(serializers.ModelSerializer):
    # Use SerializerMethodField for computed values to avoid redundant `source` warnings
    seats_available = serializers.SerializerMethodField()
    tickets_sold = serializers.SerializerMethodField()
    creator = serializers.SerializerMethodField()
    is_registered = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'date', 'location', 'capacity', 'price', 'seats_available', 'tickets_sold', 'creator', 'is_registered']

    def get_seats_available(self, obj):
        return obj.seats_available()

    def get_tickets_sold(self, obj):
        return obj.tickets_sold()

    def get_creator(self, obj):
        # Be defensive: if the DB column hasn't been migrated yet, accessing obj.creator
        # may raise. Catch any exception and return None so the API doesn't 500.
        try:
            creator = getattr(obj, 'creator', None)
            if creator:
                return {'id': creator.id, 'username': creator.username, 'email': creator.email}
        except Exception:
            # migration may be missing or related DB error; treat as no creator
            return None
        return None

    def get_is_registered(self, obj):
        # Check if the current request user has an active registration for this event
        request = self.context.get('request')
        if not request or request.user.is_anonymous:
            return False
        return obj.registrations.filter(user=request.user, canceled=False).exists()


class RegistrationSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Registration
        fields = ['id', 'user', 'event', 'email', 'created_at', 'canceled']
