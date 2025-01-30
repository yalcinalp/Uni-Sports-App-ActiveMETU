from knox.views import LoginView as KnoxLoginView
from knox.views import LogoutView as KnoxLogoutView
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import ChangePasswordSerializer 
from knox.models import AuthToken

class LoginAPI(KnoxLoginView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]

class LogoutAPI(KnoxLogoutView):
    def get_post_response(self, request):
        return Response({"message": f"Goodbye, {request.user.username}!"}, status=200)

class ChangePasswordAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            # Logout all sessions
            request.user.auth_token_set.all().delete()
            return Response({
                "message": "Password changed successfully. You have been logged out from all sessions."
            }, status=200)
        return Response(serializer.errors, status=400)