from rest_framework.permissions import AllowAny
from auth.permissions import UserPermission
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from account.models import User, Discipline, ProfileDisciplines
from account.serializers import UserSerializer, DisciplineSerializer, ProfileDisciplineSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from django.core.exceptions import ValidationError

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
    
    @action(detail=True, methods=['patch'], permission_classes=[UserPermission])
    def delete_profile_picture(self, request, pk=None):
        user = self.get_object()
        user.profile_picture.delete(save=True)
        serializer = self.get_serializer(user)
        return Response(serializer.data)
    
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
    
    def get_object(self, obj_id):
        try:
            return ProfileDisciplines.objects.get(id=obj_id)
        except ProfileDisciplines.DoesNotExist:
            raise status.HTTP_404_NOT_FOUND
            
    
    def validate_disciplines(self, id_list):
        for id in id_list:
            try:
                ProfileDisciplines.objects.get(id=id)
            except (ProfileDisciplines.DoesNotExist, ValidationError):
                raise status.HTTP_400_BAD_REQUEST
        return True
    
    def put(self, request, *args, **kwargs):
        discipline_list = request.data['profile_disciplines']
        self.validate_disciplines(discipline_list)
        instances = []
        for profile_discipline in discipline_list:
            instance = self.get_object(profile_discipline['id'])
            instance.profile_discipline_order = profile_discipline['profile_discipline_order']
            instance.save()
            instances.append(instance)
        serializer = self.get_serializer(instances, many=True)
        return Response(serializer.data)