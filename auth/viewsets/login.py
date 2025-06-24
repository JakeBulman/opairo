from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from auth.serializers import LoginSerializer

class LoginViewSet(ViewSet):
    """
    ViewSet for user login.
    Handles user authentication and returns JWT tokens upon successful login.
    """
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer
    http_method_names = ['post']

    def create(self, request):
        """
        Handle user login.
        """
        serializer = self.serializer_class(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        except TokenError as e:
            raise InvalidToken(e.args[0]) from e
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)