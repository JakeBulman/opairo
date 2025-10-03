import pytest
from account.models import User

data_user = {
	"email":"test@hotmail.com",
	"password":"test_password",
	"account_name":"Test Name",
	"account_slug":"test-name"
}

@pytest.mark.django_db
def test_create_user():
    """
    Test the creation of a user with valid data.
    """
    user = User.objects.create_user(**data_user)
    assert user.email == data_user["email"]
    assert user.account_name == data_user["account_name"]
    assert user.account_slug == data_user["account_slug"]
    assert user.check_password(data_user["password"])


data_superuser = {
	"email":"testsuper@hotmail.com",
	"password":"testsuper_password",
	"account_name":"Test Super Name",
	"account_slug":"test-super-name"
}

@pytest.mark.django_db
def test_create_superuser():
    """
    Test the creation of a superuser with valid data.
    """
    superuser = User.objects.create_superuser(**data_superuser)
    assert superuser.email == data_superuser["email"]
    assert superuser.account_name == data_superuser["account_name"]
    assert superuser.account_slug == data_superuser["account_slug"]
    assert superuser.check_password(data_superuser["password"])
    assert superuser.is_superuser
    assert superuser.is_staff