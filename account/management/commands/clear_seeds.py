from django.core.management.base import BaseCommand
from event.models import Event, Cast, CastingApplications
from account.models import User

class Command(BaseCommand):
    help = "Delete seeded users, their events, and associated cast members"

    def handle(self, *args, **kwargs):
        # Step 1: Delete seeded users
        users_to_delete = User.objects.filter(email__icontains="@example.com")
        user_count = users_to_delete.count()

        if user_count == 0:
            self.stdout.write("No users with '@example.com' found.")
        else:
            users_to_delete.delete()
            self.stdout.write(self.style.SUCCESS(f"Deleted {user_count} seeded users."))

        # Step 2: Delete events created by seed script (identified by 'Cityville' in location)
        events_to_delete = Event.objects.filter(location__icontains="Cityville")
        event_count = events_to_delete.count()

        # Step 3: Delete casts associated with these events
        cast_to_delete = Cast.objects.filter(event__in=events_to_delete)
        cast_count = cast_to_delete.count()

        # Step 0: Delete casting applications for Cityville events
        applications_to_delete = CastingApplications.objects.filter(
            cast_role__event__location__icontains="Cityville"
        )
        app_count = applications_to_delete.count()

        if app_count > 0:
            applications_to_delete.delete()
            self.stdout.write(f"Deleted {app_count} casting applications associated with Cityville casts.")

        if cast_count > 0:
            cast_to_delete.delete()
            self.stdout.write(f"Deleted {cast_count} cast members associated with Cityville events.")

        if event_count > 0:
            events_to_delete.delete()
            self.stdout.write(self.style.SUCCESS(f"Deleted {event_count} Cityville events."))
        else:
            self.stdout.write("No Cityville events found.")
