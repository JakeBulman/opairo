from rest_framework import serializers
from event.models import Event
from account.models import User
from account.serializers import UserSerializer

class EventSerializer(serializers.ModelSerializer):
    """
    Serializer for the Event model.
    This serializer is used to convert Event instances into JSON format
    and validate incoming data for creating or updating Event instances.
    """
    event_organiser_public_id = serializers.SlugRelatedField(
        queryset=User.objects.all(),
        slug_field='public_id')
    
    def validate_organiser(self, value):
        if self.context["request"].user != value:
            raise serializers.ValidationError("You can only create events for yourself.")
        if self.context["request"].user.user_type != '2':
            raise serializers.ValidationError("Only users with organiser type can create events.")
        return value

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["event_organiser"] = UserSerializer(instance.event_organiser, context=self.context).data
        return representation

    class Meta:
        model = Event
        fields = [
            'public_id',
            'created_at',
            'updated_at',
            'name',
            'date',
            'event_organiser',
        ]
        read_only_fields = ['public_id', 'created_at', 'updated_at']  # These fields should not be writable