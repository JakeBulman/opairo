from rest_framework.permissions import AllowAny
from auth.permissions import UserPermission
from rest_framework import viewsets
from account.models import User
from account.serializers import UserSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from slugify import slugify

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