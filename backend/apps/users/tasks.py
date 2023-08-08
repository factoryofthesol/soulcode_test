from django.contrib.auth import get_user_model

from config import celery_app as app

User = get_user_model()


@app.task()
def get_users_count():
    """A pointless Celery task to demonstrate usage."""
    return User.objects.count()
