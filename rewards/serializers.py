from rest_framework import serializers
from .models import CustomUser, App, TaskCompletion
from django.contrib.auth.hashers import make_password
from django.conf import settings

# User Serializer (Registration & Profile)
class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'role']

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super(CustomUserSerializer, self).create(validated_data)


# App Serializer (Admin can add apps)
class AppSerializer(serializers.ModelSerializer):
    class Meta:
        model = App
        fields = '__all__'


# Task Completion Serializer
class TaskCompletionSerializer(serializers.ModelSerializer):
    app_name = serializers.ReadOnlyField(source='app.name')

    class Meta:
        model = TaskCompletion
        fields = ['id', 'user', 'app', 'app_name', 'screenshot', 'completed_at']
