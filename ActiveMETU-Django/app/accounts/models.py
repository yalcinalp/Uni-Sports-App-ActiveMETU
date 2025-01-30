from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class FailedLogin(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    timestamp = models.DateTimeField(auto_now_add=True)

class User(AbstractUser):
    pass
