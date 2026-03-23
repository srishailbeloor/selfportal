from django.urls import path
from .views import create_namespace, home, list_k8s_namespaces, delete_namespace

urlpatterns = [
    path('', home),
    path('create/', create_namespace),
    path('list/', list_k8s_namespaces),
    path('delete/', delete_namespace),
    

]

