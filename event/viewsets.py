from rest_framework.permissions import AllowAny
from rest_framework import viewsets, status
from event.models import Event
from event.serializers import EventSerializer
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import Http404

class EventViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing event instances.
    """
    http_method_names = ['get', 'post', 'delete', 'patch']
    permission_classes = (
        AllowAny,
    )
    serializer_class= EventSerializer
    parser_classes = (MultiPartParser, FormParser)

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
        queryset = self.get_queryset()
        obj = queryset.filter(name_slug=self.kwargs['pk']).first()
        if obj is None:
            obj = queryset.filter(public_id=self.kwargs['pk']).first()
        if obj is None:
            raise Http404
        self.check_object_permissions(self.request, obj)
        return obj