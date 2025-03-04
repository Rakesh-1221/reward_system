from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from .models import CustomUser, App, TaskCompletion
from .serializers import CustomUserSerializer, AppSerializer, TaskCompletionSerializer
from rest_framework.parsers import MultiPartParser, FormParser

# User Registration
class RegisterUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.AllowAny]

# User Logout
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully"}, status=200)
        except Exception as e:
            return Response({"error": "Invalid token"}, status=400)

#  Custom Admin Permission
class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

#  Admin can add an app
class AddAppView(generics.CreateAPIView):
    queryset = App.objects.all()
    serializer_class = AppSerializer
    permission_classes = [IsAdminUser]

    def post(self, request, *args, **kwargs):
        if "app_image" not in request.FILES:
            return Response({"error": "app_image file is required"}, status=400)

        return self.create(request, *args, **kwargs)

#  Authenticated Users/Admin can view all apps
class ListAppsView(generics.ListAPIView):
    queryset = App.objects.all()
    serializer_class = AppSerializer
    permission_classes = [permissions.IsAuthenticated]

#  User Profile & Task History
class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        completed_tasks = TaskCompletion.objects.filter(user=user)
        completed_tasks_serializer = TaskCompletionSerializer(completed_tasks, many=True)

        return Response({
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "points_earned": sum(task.app.points for task in completed_tasks),
            "tasks_completed": completed_tasks_serializer.data
        })

#  Upload Screenshot for Task Completion 
class UploadTaskScreenshotView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        user = request.user
        app_id = request.data.get("app")
        screenshot = request.FILES.get("screenshot")

        if not app_id or not screenshot:
            return Response({"error": "App ID and screenshot are required"}, status=400)

        try:
            app = App.objects.get(id=app_id)
        except App.DoesNotExist:
            return Response({"error": "Invalid App ID"}, status=404)

        task = TaskCompletion.objects.create(user=user, app=app, screenshot=screenshot)
        serializer = TaskCompletionSerializer(task)

        return Response({"message": "Task uploaded successfully", "task": serializer.data}, status=201)