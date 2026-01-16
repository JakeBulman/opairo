from urllib import request
from rest_framework import serializers
from event.models import Event, Cast, CastingApplications
from account.models import User, Discipline
from account.serializers import UserSerializer


class CastingApplicationsSerializer(serializers.ModelSerializer):
    """
    Serializer for the CastingApplications model.
    This serializer is used to convert CastingApplications instances into JSON format
    and validate incoming data for creating or updating CastingApplications instances.
    """
    cast = serializers.SlugRelatedField(
        queryset=Cast.objects.all(),
        slug_field='public_id')
    applicant = serializers.SlugRelatedField(
        queryset=User.objects.all(),
        slug_field='public_id')

    def validate_cast(self, value):
        request = self.context.get("request")
        if request and request.user == value.event.organiser:
            raise serializers.ValidationError("Organisers cannot apply for roles in their own events.")
        return value

    def validate_applicant(self, value):
        request = self.context.get("request")
        if request and request.user == value.event.organiser:
            raise serializers.ValidationError("You can only apply for casting roles as yourself.")
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
        slug_field='public_id')
    
    discipline = serializers.SlugRelatedField(
        queryset=Discipline.objects.all(),
        slug_field='public_id',
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
        if request and request.user != value.event.organiser:
            raise serializers.ValidationError("You can only add cast members to your own events.")
        return value

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
        if request and request.user == value.event.organiser:
            raise serializers.ValidationError("You can only create events for yourself.")
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

    # public_id = models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)
    # created_at = models.DateTimeField(auto_now_add=True)
    # updated_at = models.DateTimeField(auto_now=True)
    # name = models.CharField(max_length=255)
    # name_slug = models.SlugField(unique=True, default='', blank=True)
    # date = models.DateField(default='2025-01-01')
    # time = models.TimeField(default='12:00')
    # event_picture = models.ImageField(upload_to=event_directory_path, null=True, blank=True)
    # location = models.CharField(max_length=255, blank=True, default='')
    # website = models.CharField(max_length=255, blank=True, default='')
    # description = models.TextField(blank=True, default='')
    # organiser = models.ForeignKey('account.User', on_delete=models.CASCADE, to_field='public_id')