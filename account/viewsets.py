from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import viewsets
from account.models import User
from account.serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing user instances.
    """
    http_method_names = ['get', 'patch']
    permission_classes = (AllowAny,)
    serializer_class= UserSerializer

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
            raise ValueError("User not found")
        return obj