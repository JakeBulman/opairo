from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth.models import update_last_login

from account.serializers import UserSerializer

class LoginSerializer(TokenObtainPairSerializer):
    """
    Custom serializer for obtaining JWT tokens.
    This serializer extends the default TokenObtainPairSerializer
    to include user information in the response.
    """
    def validate(self, attrs):
        """
        Validate the credentials and update the last login time.
        """
        data = super().validate(attrs)

        refresh = self.get_token(self.user)
        
        data['user'] = UserSerializer(self.user).data
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)
            
        return data