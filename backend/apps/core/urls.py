from django.urls import path
from django.contrib.auth import views as auth_views

from . import views

urlpatterns = [
    #path('', views.index, name='index'),
    path('tables/', views.tables, name='tables'),
    path('billing/', views.billing, name='billing'),
    path('vr/', views.vr, name='vr'),
    path('rtl/', views.rtl, name='rtl'),
    path('profile/', views.profile, name='profile'),
    path("health-check/", views.health_check, name="health_check"),
    path("exception/", views.trigger_exception, name="exception"),
    path("email-admins/", views.email_admins, name="email-admins"),
    path("version/", views.version, name="version"),
]
