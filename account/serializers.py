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
        if "profile_picture" not in representation:
            representation["profile_picture"] = settings.DEFAULT_AVATAR_URL
            return representation
        if not representation["profile_picture"]:
            representation["profile_picture"] = settings.DEFAULT_AVATAR_URL
            return representation
        if settings.DEBUG:  # debug enabled for dev
            request = self.context.get("request")
            if request:
                representation["profile_picture"] = request.build_absolute_uri(
                    representation["profile_picture"]
                )
        return representation
    
    profile_picture = serializers.ImageField(
        required=False, allow_null=True, use_url=True
    )

    class Meta:
        model = User
        fields = [
            'public_id',
            'email',
            'email_flag',
            'account_name',
            'account_slug',
            'date_of_birth',
            'profile_picture',
            'referrer',
            'user_type',
        ]
        read_only_field = ['public_id',]  # public_id should not be writable