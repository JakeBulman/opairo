from django.db import models
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404

class EventManager(models.Manager):
    '''
    Custom manager for Event model
    '''
    def get_object_by_public_id(self, public_id):
        try:
            return self.get(public_id=public_id)
        except (ObjectDoesNotExist, ValueError, TypeError):
            return Http404
    