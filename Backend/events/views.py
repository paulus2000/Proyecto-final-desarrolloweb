from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from .models import Event, Registration
from .serializers import EventSerializer, RegistrationSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class EventViewSet(viewsets.ModelViewSet):
    """
    Read/write viewset for events. Read access is open, write requires authentication.
    """
    queryset = Event.objects.all().order_by('date')
    serializer_class = EventSerializer
    # Read access is open, write (POST/PUT/PATCH/DELETE) requires authentication.
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # When an authenticated user creates an event, set them as the creator.
        user = getattr(self.request, 'user', None)
        if user and not user.is_anonymous:
            serializer.save(creator=user)
        else:
            serializer.save()

    def create(self, request, *args, **kwargs):
        # Wrap create in try/except to return JSON error instead of HTML 500
        try:
            return super().create(request, *args, **kwargs)
        except Exception as exc:
            return Response({'detail': f'Error al crear evento: {str(exc)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_queryset(self):
        # Default queryset ordered by date
        qs = Event.objects.all().order_by('date')
        # If listing and a user is authenticated, try to exclude events created by that user
        # so the UI shows only events created by others. Be defensive: if creator column
        # doesn't exist yet, just return the base queryset.
        request = getattr(self, 'request', None)
        if request and request.method == 'GET':
            try:
                user = getattr(request, 'user', None)
                if user and not user.is_anonymous:
                    return qs.exclude(creator=user).order_by('date')
            except Exception:
                # fallback to base queryset if exclude fails (e.g. missing column)
                return qs
        return qs

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def register(self, request, pk=None):
        try:
            event = self.get_object()
            user = request.user
            # ensure seats
            if event.seats_available() <= 0:
                return Response({'detail': 'No hay entradas disponibles.'}, status=status.HTTP_400_BAD_REQUEST)

            # create registration; use user.email if available, otherwise fallback to provided email or blank
            email = getattr(user, 'email', None) or request.data.get('email') or ''
            reg, created = Registration.objects.get_or_create(user=user, event=event, defaults={'email': email})
            if not created:
                return Response({'detail': 'Ya estás registrado.'}, status=status.HTTP_400_BAD_REQUEST)
            serializer = RegistrationSerializer(reg)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as exc:
            # avoid exposing HTML 500 pages; return JSON error
            return Response({'detail': f'Error al registrar: {str(exc)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def cancel(self, request, pk=None):
        try:
            event = self.get_object()
            user = request.user
            try:
                reg = Registration.objects.get(user=user, event=event, canceled=False)
            except Registration.DoesNotExist:
                return Response({'detail': 'No tienes un registro activo.'}, status=status.HTTP_400_BAD_REQUEST)
            reg.canceled = True
            reg.save()
            return Response({'detail': 'Registro cancelado.'}, status=status.HTTP_200_OK)
        except Exception as exc:
            return Response({'detail': f'Error al cancelar registro: {str(exc)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
from django.shortcuts import render

# Create your views here.
