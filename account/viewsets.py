from rest_framework.permissions import IsAuthenticated
from auth.permissions import UserPermission
from rest_framework import viewsets
from account.models import User
from account.serializers import UserSerializer
from rest_framework.parsers import MultiPartParser, FormParser

class UserViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing user instances.
    """
    http_method_names = ['get', 'patch']
    permission_classes = (
        IsAuthenticated,
        UserPermission,
    )
    serializer_class= UserSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        """
        This view should return a list of all the users
        that the user has access to.
        """
        if self.request.user.is_superuser:
            return User.objects.all()
        return User.objects.exclude(is_superuser=True)
    
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