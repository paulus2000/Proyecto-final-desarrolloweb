from django.core.management.base import BaseCommand
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from events.models import Event, Registration


class Command(BaseCommand):
    help = 'Send notification emails to users when their events start.'

    def add_arguments(self, parser):
        parser.add_argument('--window-minutes', type=int, default=1,
                            help='Time window (minutes) to consider events as starting (default: 1)')

    def handle(self, *args, **options):
        window = options['window_minutes']
        now = timezone.now()
        window_end = now + timezone.timedelta(minutes=window)

        # Find events that start between now and window_end and haven't been notified yet
        events = Event.objects.filter(date__gte=now, date__lte=window_end, notification_sent=False)
        if not events.exists():
            self.stdout.write('No upcoming events to notify.')
            return

        frontend_base = getattr(settings, 'FRONTEND_BASE_URL', 'http://localhost:5173')

        for event in events:
            regs = Registration.objects.filter(event=event, canceled=False)
            recipients = set()
            for r in regs:
                if r.email:
                    recipients.add(r.email)
                elif r.user and getattr(r.user, 'email', None):
                    recipients.add(r.user.email)

            if not recipients:
                self.stdout.write(f'Event {event.id} has no recipient emails, skipping.')
                # still mark notified to avoid repeated attempts
                event.notification_sent = True
                event.save()
                continue

            subject = f'El evento "{event.title}" está empezando ahora'
            start_local = timezone.localtime(event.date).strftime('%Y-%m-%d %H:%M')
            message = (
                f'Hola,\n\nEl evento "{event.title}" comienza ahora ({start_local}).\n\n'
                f'Descripción: {event.description or "(sin descripción)"}\n'
                f'Ver evento: {frontend_base}/events/{event.id}\n\n'
                'Gracias.'
            )

            from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'no-reply@example.com')
            try:
                send_mail(subject, message, from_email, list(recipients), fail_silently=False)
                self.stdout.write(f'Notified {len(recipients)} recipients for event {event.id}')
                event.notification_sent = True
                event.save()
            except Exception as exc:
                self.stderr.write(f'Failed to send notifications for event {event.id}: {exc}')