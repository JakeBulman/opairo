from rest_framework.permissions import AllowAny
from rest_framework import viewsets, status
from event.models import Event
from event.serializers import EventSerializer
from rest_framework.response import Response
from datetime import datetime
from sqids import Sqids
from slugify import slugify

class EventViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing event instances.
    """
    http_method_names = ['get', 'post', 'delete', 'patch']
    permission_classes = (
        AllowAny,
    )
    serializer_class= EventSerializer

    def get_queryset(self):
        """
        This view should return a list of all the events
        that the user has access to.
        """
        return Event.objects.all()
    
    def get_object(self):
        """
        This view should return an event instance.
        """
        obj = Event.filter(public_id=self.kwargs['pk']).first()

        self.check_object_permissions(self.request, obj)
        return obj
    
    def create(self, request, *args, **kwargs):
        """
        This method is called when creating a new event instance.
        A name slug is assigned based on the event name and creation datetime.
        """
        # Handle name_slug generation
        event_sqid = Sqids().encode([int(x) for x in str(round(datetime.now().timestamp()))[:5]])
        event_name_slug = slugify(f'{request.data['name']}-{event_sqid}')
        request.data['name_slug'] = event_name_slug

        # Proceed with the usual creation process
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)