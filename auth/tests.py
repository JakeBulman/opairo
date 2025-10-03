import pytest
from rest_framework import status

from fixtures.account import user

class TestAuthenticationViewSet:

    endpoint = '/auth/'

    def test_login(self, client, user):
        """
        Test the login endpoint with valid credentials.
        """
        data = {
            "email": user.email,
            "password": "test_password"
        }
        response = client.post(f'{self.endpoint}login/', data)

        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert response.data['user']['email'] == user.email
        assert response.data['user']['account_name'] == user.account_name
        assert response.data['user']['account_slug'] == user.account_slug
        assert response.data['user']['public_id'] == str(user.public_id)

    @pytest.mark.django_db
    def test_register(self, client):
        """
        Test the registration endpoint with valid data.
        """
        register_data = {
            "email":"test@hotmail.com",
            "password":"test_password",
            "account_name":"Test Name",
            "account_slug":"test-name"
        }

        response = client.post(f'{self.endpoint}register/', register_data)
        assert response.status_code == status.HTTP_201_CREATED

    def test_refresh(self, client, user):
        """
        Test the refresh token endpoint.
        """
        # First, login to get the refresh token
        login_data = {
            "email": user.email,
            "password": "test_password"
        }
        response = client.post(f'{self.endpoint}login/', login_data)
        assert response.status_code == status.HTTP_200_OK
        data_refresh = {
            "refresh": response.data['refresh']
        }

        # Now, use the refresh token to get a new access token
        response = client.post(f'{self.endpoint}refresh/', data_refresh)
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data