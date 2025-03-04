from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterUserView, LogoutView, AddAppView, ListAppsView, UserProfileView, UploadTaskScreenshotView

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),

    path('apps/', ListAppsView.as_view(), name='list_apps'),
    path('apps/add/', AddAppView.as_view(), name='add_app'),
    
    path('user/profile/', UserProfileView.as_view(), name='user_profile'),
    path('task/upload/', UploadTaskScreenshotView.as_view(), name='upload_task_screenshot'),
]
