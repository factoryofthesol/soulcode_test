# Generated by Django 3.1.13 on 2021-07-03 04:17

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="RequestLog",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("date", models.DateTimeField(auto_now_add=True)),
                ("path", models.CharField(max_length=3000)),
                ("full_path", models.CharField(max_length=3000)),
                ("execution_time", models.IntegerField(null=True)),
                ("response_code", models.PositiveIntegerField()),
                ("method", models.CharField(max_length=10, null=True)),
                ("remote_address", models.CharField(max_length=20, null=True)),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]