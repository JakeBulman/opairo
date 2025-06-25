import pytest
from rest_framework.test import APIClient

@pytest.fixture
def client():
    """
    Fixture to create an API client for testing.
    This client can be used to make requests to the API endpoints.
    """
    return APIClient()