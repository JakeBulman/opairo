from django.db import models
import uuid
import pathlib


class Event(models.Model):
    """
    Model representing an event.
    """

    def event_directory_path(instance, filename):
        # File will be uploaded to MEDIA_ROOT/event/<event_id>.<filename.suffix>
        return '{0}/{1}{2}'.format('event', instance.public_id, pathlib.Path(filename).suffix)
    

    public_id = models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=255)
    name_slug = models.SlugField(unique=True, default='', blank=True)
    date = models.DateField(default='2025-01-01')
    time = models.TimeField(default='12:00')
    event_picture = models.ImageField(upload_to=event_directory_path, null=True, blank=True)
    location = models.CharField(max_length=255, blank=True, default='')
    website = models.CharField(max_length=255, blank=True, default='')
    description = models.TextField(blank=True, default='')
    organiser = models.ForeignKey('account.User', on_delete=models.CASCADE, to_field='public_id')

    def __str__(self):
        return self.name





