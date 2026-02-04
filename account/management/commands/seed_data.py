import random
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from django.utils import timezone
from django.core.files.base import ContentFile
import requests

from account.models import User, ProfileDisciplines, Discipline

SAMPLE_USERS = [
    {"account_name": "Alice Harper", "email_flag": True, "user_type": "1"},
    {"account_name": "Bob Sterling", "email_flag": False, "user_type": "2"},
    {"account_name": "Clara James", "email_flag": True, "user_type": "1"},
    {"account_name": "David Morgan", "email_flag": True, "user_type": "2"},
    {"account_name": "Emma Lawson", "email_flag": False, "user_type": "1"},
    {"account_name": "Frank Owens", "email_flag": True, "user_type": "2"},
    {"account_name": "Grace Flynn", "email_flag": False, "user_type": "1"},
    {"account_name": "Henry Boyd", "email_flag": True, "user_type": "2"},
    {"account_name": "Isla Bennett", "email_flag": True, "user_type": "1"},
    {"account_name": "Jack Palmer", "email_flag": False, "user_type": "2"},
    {"account_name": "Karen Hughes", "email_flag": True, "user_type": "1"},
    {"account_name": "Liam Cooper", "email_flag": True, "user_type": "2"},
    {"account_name": "Mia Fox", "email_flag": False, "user_type": "1"},
    {"account_name": "Noah Grant", "email_flag": True, "user_type": "2"},
    {"account_name": "Olivia Shaw", "email_flag": True, "user_type": "1"},
    {"account_name": "Peter Hunt", "email_flag": False, "user_type": "2"},
    {"account_name": "Quinn Barker", "email_flag": True, "user_type": "1"},
    {"account_name": "Rachel Knight", "email_flag": True, "user_type": "2"},
    {"account_name": "Samuel Rice", "email_flag": False, "user_type": "1"},
    {"account_name": "Tina Lawrence", "email_flag": True, "user_type": "2"},
    {"account_name": "Uma Wallace", "email_flag": True, "user_type": "1"},
    {"account_name": "Victor Ellis", "email_flag": False, "user_type": "2"},
    {"account_name": "Wendy Shaw", "email_flag": True, "user_type": "1"},
    {"account_name": "Xavier Reed", "email_flag": True, "user_type": "2"},
    {"account_name": "Yara Miles", "email_flag": False, "user_type": "1"},
    {"account_name": "Zachary Quinn", "email_flag": True, "user_type": "2"},
    {"account_name": "Amy Foster", "email_flag": True, "user_type": "1"},
    {"account_name": "Brian Cole", "email_flag": False, "user_type": "2"},
    {"account_name": "Chloe Turner", "email_flag": True, "user_type": "1"},
    {"account_name": "Dylan Carter", "email_flag": True, "user_type": "2"},
    {"account_name": "Ella West", "email_flag": False, "user_type": "1"},
    {"account_name": "Finn Brooks", "email_flag": True, "user_type": "2"},
    {"account_name": "Gabriella Hughes", "email_flag": True, "user_type": "1"},
    {"account_name": "Hugo Mason", "email_flag": False, "user_type": "2"},
    {"account_name": "Ivy Russell", "email_flag": True, "user_type": "1"},
    {"account_name": "Jason Knight", "email_flag": True, "user_type": "2"},
    {"account_name": "Kayla Bell", "email_flag": False, "user_type": "1"},
    {"account_name": "Leo Murphy", "email_flag": True, "user_type": "2"},
    {"account_name": "Mia Spencer", "email_flag": True, "user_type": "1"},
    {"account_name": "Nathan Fox", "email_flag": False, "user_type": "2"},
    {"account_name": "Olivia Hayes", "email_flag": True, "user_type": "1"},
    {"account_name": "Patrick Ward", "email_flag": True, "user_type": "2"},
    {"account_name": "Quinn Porter", "email_flag": False, "user_type": "1"},
    {"account_name": "Ruby Knight", "email_flag": True, "user_type": "2"},
    {"account_name": "Sophia Green", "email_flag": True, "user_type": "1"},
    {"account_name": "Thomas Scott", "email_flag": False, "user_type": "2"},
    {"account_name": "Uma Johnson", "email_flag": True, "user_type": "1"},
    {"account_name": "Victor Adams", "email_flag": True, "user_type": "2"},
    {"account_name": "Willow Lane", "email_flag": False, "user_type": "1"},
    {"account_name": "Xavier Hughes", "email_flag": True, "user_type": "2"},
]

def generate_avatar(seed_name):
    """Fetch 256x256 avatar from i.pravatar.cc with deterministic seed"""
    url = f"https://i.pravatar.cc/256?u={slugify(seed_name)}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return ContentFile(response.content, name=f"{slugify(seed_name)}.png")
    except requests.RequestException:
        return None

class Command(BaseCommand):
    help = "Seed users with avatars, referrals, and ProfileDisciplines"

    def handle(self, *args, **kwargs):
        created_users = []
        self.stdout.write("Seeding 50 users...")

        # Fetch disciplines once
        disciplines = list(Discipline.objects.exclude(discipline_name='Organiser'))
        if not disciplines:
            self.stdout.write(self.style.ERROR("No disciplines found. Fill Discipline table first."))
            return

        for i, user_data in enumerate(SAMPLE_USERS, start=1):
            email = f"user{i}@example.com"
            account_name = user_data["account_name"]
            account_slug = slugify(account_name)
            date_of_birth = timezone.datetime(
                year=random.randint(1985, 1995),
                month=random.randint(1, 12),
                day=random.randint(1, 28)
            ).date()

            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "account_name": account_name,
                    "account_slug": account_slug,
                    "date_of_birth": date_of_birth,
                    "user_type": user_data["user_type"],
                    "email_flag": user_data["email_flag"],
                }
            )

            if created:
                # Assign profile picture
                avatar_file = generate_avatar(email)
                if avatar_file:
                    user.profile_picture = avatar_file
                    user.save()

                created_users.append(user)
                self.stdout.write(self.style.SUCCESS(f"Created user {email}"))
            else:
                self.stdout.write(f"User {email} already exists, skipping.")

        # Randomly assign referrals (30% chance)
        for user in created_users:
            possible_referrers = [u for u in created_users if u != user]
            if possible_referrers and random.random() < 0.3:
                user.referrer = random.choice(possible_referrers)
                user.save()

        # Assign ProfileDisciplines
        self.stdout.write("Seeding ProfileDisciplines...")
        for user in created_users:
            # Delete existing
            user.profile_disciplines.all().delete()

            if user.user_type == "2":  # Organiser
                try:
                    discipline = Discipline.objects.get(discipline_name='Organiser')
                    user_disciplines = [discipline]
                except Discipline.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f"Organiser missing. Skipping {user.email}"))
                    continue
            else:  # Artist
                user_disciplines = random.sample(disciplines, k=random.randint(1, 5))

            # Create ProfileDisciplines with order
            for order, discipline in enumerate(user_disciplines, start=1):
                ProfileDisciplines.objects.create(
                    profile=user,
                    discipline=discipline,
                    profile_discipline_order=order
                )

        self.stdout.write(self.style.SUCCESS("Seeding complete!"))
