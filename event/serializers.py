from urllib import request
from rest_framework import serializers
from event.models import Event, Cast, CastingApplications
from account.models import User, Discipline
from account.serializers import UserSerializer, DisciplineSerializer


class CastingApplicationsSerializer(serializers.ModelSerializer):
    """
    Serializer for the CastingApplications model.
    This serializer is used to convert CastingApplications instances into JSON format
    and validate incoming data for creating or updating CastingApplications instances.
    """
    cast_role = serializers.SlugRelatedField(
        queryset=Cast.objects.all(),
        slug_field='public_id')
    applicant = UserSerializer(read_only=True)

    def validate_cast(self, value):
        request = self.context.get("request")
        if request and request.user == value.cast_role.event.organiser:
            raise serializers.ValidationError("Organisers cannot apply for roles in their own events.")
        return value

    class Meta:
        model = CastingApplications
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
        slug_field='name_slug')
    
    discipline = serializers.PrimaryKeyRelatedField(
        queryset=Discipline.objects.all(),
        allow_null=True, required=False)
    
    final_account = serializers.SlugRelatedField(
        queryset=User.objects.all(),
        slug_field='public_id',
        allow_null=True, required=False)

    casting_applications = CastingApplicationsSerializer(
        many=True,
        read_only=True
    )
    
    def validate_event(self, value):
        request = self.context.get("request")
        if request and request.user != value.organiser:
            raise serializers.ValidationError("You can only add cast members to your own events.")
        return value
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["discipline"] = DisciplineSerializer(instance.discipline, context=self.context).data
        return representation

    class Meta:
        model = Cast
        fields = '__all__'
        read_only_fields = ['public_id', 'created_at', 'updated_at']

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

    cast = CastSerializer(
        many=True,
        read_only=True
    )

    def validate_organiser(self, value):
        request = self.context.get("request")
        if request and request.user.user_type != '2':
            raise serializers.ValidationError("Only users with organiser type can create events.")
        return value

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["organiser"] = UserSerializer(instance.organiser, context=self.context).data
        return representation

    class Meta:
        model = Event
        fields = [
            "public_id",
            "created_at",
            "updated_at",
            "name",
            "name_slug",
            "date",
            "time",
            "event_picture",
            "location",
            "website",
            "description",
            "organiser",
            "cast",
            

        ]
        read_only_fields = ['public_id', 'created_at', 'updated_at']