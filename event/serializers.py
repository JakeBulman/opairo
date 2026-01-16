from rest_framework import serializers
from event.models import Event, Cast, CastingApplications
from account.models import User
from account.serializers import UserSerializer

class EventSerializer(serializers.ModelSerializer):
    """
    Serializer for the Event model.
    This serializer is used to convert Event instances into JSON format
    and validate incoming data for creating or updating Event instances.
    """
    organiser = serializers.SlugRelatedField(
        queryset=User.objects.all(),
        slug_field='public_id')
    
    event_picture = serializers.ImageField(
        required=False, allow_null=True, use_url=True
    )

    def validate_organiser(self, value):
        if self.context["request"].user != value:
            raise serializers.ValidationError("You can only create events for yourself.")
        if self.context["request"].user.user_type != '2':
            raise serializers.ValidationError("Only users with organiser type can create events.")
        return value

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["organiser"] = UserSerializer(instance.organiser, context=self.context).data
        return representation

    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['public_id', 'created_at', 'updated_at']

class CastSerializer(serializers.ModelSerializer):
    """
    Serializer for the Cast model.
    This serializer is used to convert Cast instances into JSON format
    and validate incoming data for creating or updating Cast instances.
    """
    event = serializers.SlugRelatedField(
        queryset=Event.objects.all(),
        slug_field='public_id')
    
    def validate_event(self, value):
        if self.context["request"].user != value.organiser:
            raise serializers.ValidationError("You can only add cast members to your own events.")
        return value

    class Meta:
        model = Cast
        fields = '__all__'
        read_only_fields = ['public_id', 'created_at', 'updated_at']

class CastingApplicationsSerializer(serializers.ModelSerializer):
    """
    Serializer for the CastingApplications model.
    This serializer is used to convert CastingApplications instances into JSON format
    and validate incoming data for creating or updating CastingApplications instances.
    """
    cast_role = serializers.SlugRelatedField(
        queryset=Cast.objects.all(),
        slug_field='public_id')
    applicant = serializers.SlugRelatedField(
        queryset=User.objects.all(),
        slug_field='public_id')

    def validate_cast_role(self, value):
        if self.context["request"].user == value.event.organiser:
            raise serializers.ValidationError("Organisers cannot apply for roles in their own events.")
        return value

    def validate_applicant(self, value):
        if self.context["request"].user != value:
            raise serializers.ValidationError("You can only apply for casting roles as yourself.")
        return value

    class Meta:
        model = CastingApplications
        fields = '__all__'
        read_only_fields = ['public_id', 'created_at', 'updated_at']