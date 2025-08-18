from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from account.managers import CustomUserManager
import uuid
import pathlib


class User(AbstractUser):
    """
    Custom user model which doesn't have a username, 
    but has a unique email and a date_of_birth. 
    This model is used for both superusers and 
    regular users as well.
    """
    def user_directory_path(instance, filename):
        # File will be uploaded to MEDIA_ROOT/user_<id>/<filename>
        return '{0}/{1}{2}'.format('profile', instance.public_id, pathlib.Path(filename).suffix)
    
    # The inherited field 'username' is nullified, so it will 
    # neither become a DB column nor will it be required.
    public_id = models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)
    username = None
    email = models.EmailField(_("email address"), unique=True)
    email_flag = models.BooleanField(null=True)
    account_name = models.CharField(max_length=255)
    account_slug = models.SlugField(unique=True)
    date_of_birth = models.DateField(verbose_name="Birthday",null=True)
    profile_picture = models.ImageField(upload_to=user_directory_path, null=True, blank=True)
    referrer = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='referrals', to_field='public_id')
    user_type = models.CharField(max_length=50, choices=[
        ('1', 'Artist'),
        ('2', 'Organiser'),
    ], default='1', verbose_name="User Type")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["account_name",]  # The USERNAME_FIELD aka 'email' cannot be included here
    objects = CustomUserManager()
    def __str__(self):
        return self.email
