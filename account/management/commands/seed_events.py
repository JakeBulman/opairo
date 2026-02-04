import random
import pathlib
from io import BytesIO
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from django.core.files.base import ContentFile
import requests

from event.models import Event, Cast, CastingApplications
from account.models import User, Discipline

EVENT_NAMES = [
    "Summer Jam", "Art & Soul", "Music Fest", "Urban Vibes", "Dance Mania",
    "Creative Minds", "Night Beats", "Global Rhythms", "Fusion Fiesta", "Culture Connect",
    "Open Stage", "Weekend Groove", "Melody Makers", "Rhythm Rally", "Artbeat",
    "The Big Show", "City Lights", "Festival Fusion", "Soundwave", "Pulse Party"
]

CAST_NAMES = [
    "Thomas Covenant", "Martha Quest", "Rand al'Thor", "Mat Cauthon",
    "Perrin Aybara", "Egwene al'Vere", "Elayne Trakand", "Nynaeve al'Meara",
    "Richard Cypher", "Kahlan Amnell", "Zeddicus Zu'l Zorander", "Brandon Sanderson",
    "Vin Venture", "Elend Venture", "Sazed", "Spook", "FitzChivalry Farseer",
    "Chade Fallstar", "Nighteyes", "Verity Rahl", "Simon Snow",
    "Penelope Clearwater", "Shasta", "Aravis Tarkheena", "Breehy-hinny-brinny-hoohy-hah",
    "Taran", "Eilonwy", "Fflewddur Fflam", "Gurgi", "Meg Murry",
    "Charles Wallace", "Calvin O'Keefe", "Mrs Whatsit", "Mrs Who", "Mrs Which",
    "Coraline Jones", "Wybie Lovat", "Chihiro Ogino", "Haku",
    "Howl Jenkins", "Sophie Hatter", "Calcifer", "Kiki", "Jiji",
    "Gregor Samsa", "Grete Samsa", "Kafkaesque", "Lemony Snicket",
    "Count Olaf", "Sunny Baudelaire", "Klaus Baudelaire", "Violet Baudelaire",
    "Milo Thatch", "Kida Nedakh", "Taran MacQuarrie", "Ponyo",
    "Sosuke", "Arrietty Clock", "Shawn", "Lydia", "Momo",
    "Bastian Balthazar", "Falkor", "Atreyu", "Moonface", "Hortensia"
]

def generate_event_image(seed_name):
    """
    Fetch a 256x256 placeholder image for an event.
    Uses picsum.photos with a deterministic seed.
    """
    url = f"https://picsum.photos/256?random={slugify(seed_name)}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return ContentFile(response.content, name=f"{slugify(seed_name)}.png")
    except requests.RequestException:
        return None

class Command(BaseCommand):
    help = "Seed Event data"

    def handle(self, *args, **kwargs):
        organisers = User.objects.filter(user_type="2", email__icontains="@example.com")
        if not organisers.exists():
            self.stdout.write(self.style.ERROR("No organisers found. Seed users first."))
            return

        self.stdout.write("Seeding 20 events...")

        for name in EVENT_NAMES:
            # Check for uniqueness
            if Event.objects.filter(name=name).exists():
                self.stdout.write(f"Event '{name}' already exists, skipping.")
                continue

            # Random date in the future (2025–2026)
            event_date = datetime.now().date() + timedelta(days=random.randint(30, 365))

            # Random time
            event_time = datetime.now().time().replace(
                hour=random.randint(10, 22),
                minute=random.choice([0, 15, 30, 45]),
                second=0,
                microsecond=0
            )

            organiser = random.choice(organisers)

            event = Event.objects.create(
                name=name,
                name_slug=slugify(name),
                date=event_date,
                time=event_time,
                location=f"{random.randint(100,999)} Main Street, Cityville",
                website=f"https://www.{slugify(name)}.com",
                description=f"This is the official description for {name}.",
                organiser=organiser
            )

            # Assign placeholder event picture
            image_file = generate_event_image(name)
            if image_file:
                event.event_picture = image_file
                event.save()

            self.stdout.write(self.style.SUCCESS(f"Created event '{name}'"))

        self.stdout.write(self.style.SUCCESS("Event seeding complete!"))

        events = list(Event.objects.all())
        if not events:
            self.stdout.write(self.style.ERROR("No events found. Seed events first."))
            return

        # Fetch all disciplines except ID 2
        disciplines = list(Discipline.objects.exclude(discipline_name='Organiser'))
        if not disciplines:
            self.stdout.write(self.style.ERROR("No valid disciplines found (IDs 1-10 excluding 2)."))
            return

        self.stdout.write("Seeding Cast members...")

        for event in events:
            # Decide number of cast members per event (3–6)
            num_cast = random.randint(3, 6)

            for _ in range(num_cast):
                name = random.choice(CAST_NAMES)
                discipline = random.choice(disciplines)

                Cast.objects.create(
                    name=name,
                    event=event,
                    discipline=discipline,
                    final_account=None  # always null
                )

            self.stdout.write(self.style.SUCCESS(f"Created {num_cast} cast members for event '{event.name}'"))

        self.stdout.write(self.style.SUCCESS("Cast seeding complete!"))

        # --- Seed CastingApplications ---
        self.stdout.write("Seeding CastingApplications...")

        # Get all Artist users (user_type="1")
        artist_users = list(User.objects.filter(user_type="1", email__icontains="@example.com"))

        # Loop through all newly created Cast members
        for cast_member in Cast.objects.filter(event__location__icontains="Cityville"):
            # Decide how many applications to create (1–3)
            num_applications = random.randint(1, 3)

            for _ in range(num_applications):
                applicant = random.choice(artist_users)
                CastingApplications.objects.create(
                    cast_role=cast_member,
                    applicant=applicant,
                    status='p'  # pending by default
                )

        self.stdout.write(self.style.SUCCESS("CastingApplications seeding complete!"))