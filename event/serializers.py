from urllib import request
from rest_framework import serializers
from event.models import Event, Cast, CastingApplications
from account.models import User, Discipline
from account.serializers import UserSerializer, DisciplineSerializer, DisciplineInlineSerializer

class CastInlineSerializer(serializers.ModelSerializer):
    discipline = DisciplineSerializer(read_only=True)

    class Meta:
        model = Cast
        fields = (
            'public_id',
            'name',
            'discipline',
        )

class CastingApplicationsSerializer(serializers.ModelSerializer):
    """
    Serializer for CastingApplications.
    """

    applicant = serializers.SerializerMethodField()
    cast_role = serializers.PrimaryKeyRelatedField(read_only=True)

    def get_applicant(self, obj):
        user = obj.applicant
        return {
            "public_id": user.public_id,
            "account_name": user.account_name,
            "account_slug": user.account_slug,
        }

    class Meta:
        model = CastingApplications
        fields = [
            'public_id',
            'created_at',
            'updated_at',
            'status',
            'applicant',
            'cast_role',
        ]
        read_only_fields = ['public_id', 'created_at', 'updated_at']

class CastSerializer(serializers.ModelSerializer):
    """
    Serializer for the Cast model.
    """

    event = serializers.SlugRelatedField(
        queryset=Event.objects.all(),
        slug_field='name_slug'
    )


    discipline = DisciplineInlineSerializer(read_only=True)
    final_account = serializers.SerializerMethodField()

    casting_applications = CastingApplicationsSerializer(
        many=True,
        read_only=True
    )

    #TEMPORARY
    def to_representation(self, instance):
        assert not hasattr(instance.final_account, 'profile_disciplines'), \
            "CastSerializer is accidentally pulling profile_disciplines"
        return super().to_representation(instance)


    def get_final_account(self, obj):
        if not obj.final_account:
            return None
        return {
            "public_id": obj.final_account.public_id,
            "account_name": obj.final_account.account_name,
            "account_slug": obj.final_account.account_slug,
        }

    def validate_event(self, value):
        request = self.context.get("request")
        if request and request.user != value.organiser:
            raise serializers.ValidationError(
                "You can only add cast members to your own events."
            )
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
    organiser = UserSerializer(read_only=True)

    organiser_id = serializers.SlugRelatedField(
        queryset=User.objects.all(),
        slug_field='public_id',
        source='organiser',
        write_only=True
    )
    
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
            "organiser_id",
            "cast",
            

        ]
        read_only_fields = ['public_id', 'created_at', 'updated_at']