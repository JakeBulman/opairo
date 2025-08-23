from rest_framework.permissions import AllowAny
from rest_framework import viewsets, status
from event.models import Event
from event.serializers import EventSerializer
from rest_framework.response import Response

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
        It sets the organiser to the current user.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)