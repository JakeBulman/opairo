from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from auth.serializers import RegisterSerializer
from account.models import User

class RegisterViewSet(ViewSet):
    """
    ViewSet for user registration.
    Handles user creation and returns JWT tokens upon successful registration.
    """
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer
    http_method_names = ['post']

    def create(self, request):
        """
        Handle user registration.
        """
        # Convert account slug into account pk for foreign key
        referrer_data = request.data['referrer']
        if referrer_data:
            referrer_pk = User.objects.filter(account_slug=referrer_data).first().public_id
            request.data['referrer'] = referrer_pk
            
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


