"""
URL configuration for opairo project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from rest_framework import routers
from account.viewsets import UserViewSet, DisciplineViewSet, ProfileDisciplineViewSet
from event.viewsets import EventViewSet
from auth.viewsets.register import RegisterViewSet
from auth.viewsets.login import LoginViewSet
from auth.viewsets.refresh import RefreshViewSet
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

router = routers.DefaultRouter()

#MAIN
router.register(r'account', UserViewSet, basename='account')
router.register(r'disciplines', DisciplineViewSet, basename='disciplines')
router.register(r'profile-disciplines', ProfileDisciplineViewSet, basename='profile-disciplines')
router.register(r'event', EventViewSet, basename='event')

#AUTH
router.register(r'auth/register', RegisterViewSet, basename='auth-register')
router.register(r'auth/login', LoginViewSet, basename='auth-login')
router.register(r'auth/refresh', RefreshViewSet, basename='auth-refresh')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)