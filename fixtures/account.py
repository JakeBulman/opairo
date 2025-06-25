import pytest
from account.models import User

data_user = {
	"email":"test@hotmail.com",
	"password":"test_password",
	"account_name":"Test Name",
	"account_slug":"test-name"
}

@pytest.fixture
def user(db) -> User:
    """
    Fixture to create a user instance for testing.
    """
    return User.objects.create_user(**data_user)