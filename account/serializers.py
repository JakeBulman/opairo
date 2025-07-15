from rest_framework import serializers
from account.models import User
from django.conf import settings

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.
    This serializer is used to convert User instances into JSON format
    and validate incoming data for creating or updating User instances.
    """
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if not representation["profile_picture"]:
            representation["profile_picture"] = settings.DEFAULT_AVATAR_URL
            return representation
        if settings.DEBUG:  # debug enabled for dev
            request = self.context.get("request")
            representation["profile_picture"] = request.build_absolute_uri(
                representation["profile_picture"]
            )
        return representation

    class Meta:
        model = User
        fields = [
            'public_id',
            'email',
            'account_name',
            'account_slug',
            'date_of_birth',
            'profile_picture',
        ]
        read_only_field = ['public_id',]  # public_id should not be writable