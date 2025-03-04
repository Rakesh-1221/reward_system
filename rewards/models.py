from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ADMIN = 'admin'
    USER = 'user'
    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (USER, 'User'),
    ]
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=USER)

    # Add related_name to fix conflicts
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="customuser_groups",
        blank=True
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="customuser_permissions",
        blank=True
    )

    def is_admin(self):
        return self.role == self.ADMIN

    def is_user(self):
        return self.role == self.USER

    def __str__(self):
        return self.username
    
    class Meta:
        db_table = "custom_users"  # Set a custom table name


# App Model to store Android application details
class App(models.Model):
    CATEGORY_CHOICES = [
        ('Entertainment', 'Entertainment'),
        ('Gaming', 'Gaming'),
        ('Education', 'Education'),
        ('Social', 'Social'),
        ('Shopping', 'Shopping'),
    ]

    name = models.CharField(max_length=255, unique=True)
    app_image = models.ImageField(upload_to='app_images/')
    app_link = models.URLField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    sub_category = models.CharField(max_length=100)
    points = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name
    
    class Meta:
        db_table = "apps" 

# TaskCompletion Model to track user task completion
class TaskCompletion(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    app = models.ForeignKey(App, on_delete=models.CASCADE)
    screenshot = models.ImageField(upload_to='task_screenshots/')
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.app.name}"
    
    class Meta:
        db_table = "task_completions"
