from rest_framework import serializers

from account.serializers import UserSerializer
from account.models import User

class RegisterSerializer(UserSerializer):
    """
    Registration serializer for creating users and requests.
    """
    password = serializers.CharField(
        write_only=True,
        max_length=128,
        min_length=8,   
        required=True)
    
    class Meta:
        model = User
        fields = [
            'public_id',
            'email',
            'email_flag',
            'account_name',
            'account_slug',
            'date_of_birth',
            'password',
            'referrer',
            'user_type',
        ]

    def create(self, validated_data):
        """
        Create a new user instance with the provided validated data.
        """
        return User.objects.create_user(**validated_data)