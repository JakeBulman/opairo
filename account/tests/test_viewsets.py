# from rest_framework import status

# from fixtures.account import user

# class TestUserViewSet:
#     """
#     Test suite for UserViewSet.
#     This class contains tests for user-related endpoints.
#     """

#     endpoint = '/account/'

#     def test_user_list(self, client, user):
#         """
#         Test the user list endpoint.
#         """
#         client.force_authenticate(user=user)
#         response = client.get(self.endpoint)
#         assert response.status_code == status.HTTP_200_OK
#         assert response.data["count"] == 1

#     def test_user_detail(self, client, user):
#         """
#         Test the user detail endpoint.
#         """
#         response = client.get(f'{self.endpoint}{user.public_id}/')
#         assert response.status_code == status.HTTP_200_OK
#         assert response.data['email'] == user.email
    
#     def test_user_update(self, client, user):
#         """
#         Test the user update endpoint.
#         """
#         update_data = {
#             "account_name": "Updated Name",
#             "account_slug": "updated-name"
#         }
#         response = client.patch(f'{self.endpoint}{user.public_id}/', update_data)
#         assert response.status_code == status.HTTP_200_OK
#         assert response.data['account_name'] == update_data['account_name']
#         assert response.data['account_slug'] == update_data['account_slug']

#     def test_create(self, client, user):
#         client.force_authenticate(user=user)

#         # We are expecting a 405 error, so the data will be an empty dict
#         data = {}

#         response = client.post(self.endpoint, data)
#         assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED


from rest_framework import status
from rest_framework.test import APITestCase

from fixtures.account import user



class TestUserViewSet:

    endpoint = "/account/"

    def test_list(self, client, user):
        client.force_authenticate(user=user)
        response = client.get(self.endpoint)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1

    def test_retrieve(self, client, user):
        client.force_authenticate(user=user)
        response = client.get(self.endpoint + str(user.public_id) + "/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["public_id"] == str(user.public_id)
        assert response.data["email"] == user.email

    def test_create(self, client, user):
        client.force_authenticate(user=user)

        # We are expecting a 405 error, so the data will be an empty dict
        data = {}

        response = client.post(self.endpoint, data)
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_update(self, client, user):
        client.force_authenticate(user=user)
        data = {
            "account_name": "test_user_updated",
        }

        response = client.patch(self.endpoint + str(user.public_id) + "/", data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["account_name"] == data["account_name"]