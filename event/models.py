from django.db import models
import uuid


class Event(models.Model):
    public_id = models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=255)
    name_slug = models.SlugField(unique=True, default='', blank=True)
    date = models.DateField(default='2025-01-01')
    time = models.TimeField(default='12:00')
    organiser = models.ForeignKey('account.User', on_delete=models.CASCADE, to_field='public_id')

    def __str__(self):
        return self.name





