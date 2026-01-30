from rest_framework.permissions import AllowAny
from rest_framework import viewsets, status
from event.models import Event, Cast, CastingApplications
from account.models import ProfileDisciplines
from event.serializers import EventSerializer, CastSerializer, CastingApplicationsSerializer
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.http import Http404
from django.db.models import Prefetch

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
        profile_disciplines_qs = (
            ProfileDisciplines.objects
            .select_related('discipline')
        )

        return (
            Event.objects
            .select_related('organiser')
            .prefetch_related(
                # organiser
                Prefetch(
                    'organiser__profile_disciplines',
                    queryset=profile_disciplines_qs,
                    to_attr='prefetched_profile_disciplines'
                ),

                # cast applicants
                Prefetch(
                    'cast__casting_applications__applicant__profile_disciplines',
                    queryset=profile_disciplines_qs,
                    to_attr='prefetched_profile_disciplines'
                ),

                # cast final_account (THIS IS MISSING)
                Prefetch(
                    'cast__final_account__profile_disciplines',
                    queryset=profile_disciplines_qs,
                    to_attr='prefetched_profile_disciplines'
                ),

                'cast__discipline',
                'cast__casting_applications',
                'cast__casting_applications__applicant',
            )
        )



    
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
    
class CastViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing cast instances.
    """
    http_method_names = ['get', 'post', 'delete', 'patch']
    permission_classes = (
        AllowAny,
    )
    serializer_class= CastSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        """
        This view should return a list of all the casts
        that the user has access to.
        """
        return Cast.objects.select_related(
            'event',
            'discipline',
            'final_account'
        ).prefetch_related(
            Prefetch(
                'casting_applications',
                queryset=CastingApplications.objects.select_related('applicant')
            )
        )

    
    def get_object(self):
        """
        This view should return a cast instance.
        """
        queryset = self.get_queryset()
        obj = queryset.filter(public_id=self.kwargs['pk']).first()
        if obj is None:
            raise Http404
        self.check_object_permissions(self.request, obj)
        return obj
    
class CastingApplicationsViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing casting applications instances.
    """
    http_method_names = ['get', 'post', 'delete', 'patch']
    permission_classes = (
        AllowAny,
    )
    serializer_class= CastingApplicationsSerializer
    parser_classes = (JSONParser, MultiPartParser, FormParser)

    def get_queryset(self):
        """
        This view should return a list of all the casting applications
        that the user has access to.
        """
        
        return (
            CastingApplications.objects
            .select_related('applicant', 'cast_role')
            .prefetch_related(
                Prefetch(
                    'applicant__profile_disciplines',
                    queryset=ProfileDisciplines.objects.select_related('discipline'),
                    to_attr='prefetched_profile_disciplines'
                )
            )
        )

    
    def get_object(self):
        """
        This view should return a casting application instance.
        """
        queryset = self.get_queryset()
        obj = queryset.filter(public_id=self.kwargs['pk']).first()
        if obj is None:
            raise Http404
        self.check_object_permissions(self.request, obj)
        return obj
    
    def perform_create(self, serializer):
        serializer.save(applicant=self.request.user)