from django.contrib.auth import get_user_model
from django.contrib.auth.signals import user_logged_in, user_login_failed
from django.dispatch import receiver
from accounts.models import FailedLogin

@receiver(user_logged_in)
def user_logged_recv(sender, request, user, **kwargs):
    FailedLogin.objects.filter(user=user).delete()

@receiver(user_login_failed)
def user_login_failed_recv(sender, credentials, request, **kwargs):
    User = get_user_model()
    try:
        u = User.objects.get(username=credentials.get('username'))
        FailedLogin.objects.create(user=u)
        if FailedLogin.objects.filter(user=u).count() >= 3:
            pass
            # Deactivate the user after three attempts or more
            # Or, maybe not. :| TODO: Decide on what to do.
            # u.is_active = False
            # u.save()
    except User.DoesNotExist:
        # User not found, we can not do anything
        pass