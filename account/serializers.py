from rest_framework import serializers
from account.models import User

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.
    This serializer is used to convert User instances into JSON format
    and validate incoming data for creating or updating User instances.
    """
    class Meta:
        model = User
        fields = [
            'public_id',
            'email',
            'account_name',
            'account_slug',
            'date_of_birth',
        ]
        read_only_fields = ['public_id',]  # public_id should not be writable