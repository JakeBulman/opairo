from django.contrib import admin

# Register your models here.

from event.models import Event, Cast, CastingApplications
admin.site.register(Event)
admin.site.register(Cast)
admin.site.register(CastingApplications)