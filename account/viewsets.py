from rest_framework.permissions import AllowAny
from auth.permissions import UserPermission
from rest_framework import viewsets
from account.models import User, Discipline, ProfileDisciplines
from account.serializers import UserSerializer, DisciplineSerializer, ProfileDisciplineSerializer
from rest_framework.parsers import MultiPartParser, FormParser

class UserViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing user instances.
    """
    http_method_names = ['get', 'patch']
    permission_classes = (
        AllowAny,
        UserPermission,
    )
    serializer_class= UserSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        """
        This view should return a list of all the users
        that the user has access to.
        """
        query = self.request.query_params.get('query')
        if self.request.user.is_superuser:
            return User.objects.all()
        if not query:
            return User.objects.exclude(is_superuser=True)
        else: 
            return User.objects.exclude(is_superuser=True).filter(account_slug__contains=query)
    
    def get_object(self):
        """
        This view should return the user instance
        that the user has access to.
        """
        queryset = self.get_queryset()
        obj = queryset.filter(account_slug=self.kwargs['pk']).first()
        if obj is None:
            obj = queryset.filter(public_id=self.kwargs['pk']).first()

        self.check_object_permissions(self.request, obj)
        return obj
    
class DisciplineViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing discipline instances.
    """
    http_method_names = ['get']
    permission_classes = (
        AllowAny,
    )
    serializer_class= DisciplineSerializer

    def get_queryset(self):
        """
        This view should return a list of all the disciplines.
        """
        return Discipline.objects.all()
    
class ProfileDisciplineViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing profile discipline instances.
    """
    http_method_names = ['get', 'post', 'delete']
    permission_classes = (
        AllowAny,
    )
    serializer_class= ProfileDisciplineSerializer

    def get_queryset(self):
        """
        This view should return a list of all the profile disciplines
        that the user has access to.
        """
        return ProfileDisciplines.objects.filter(profile=self.request.user.profile)