from django.db import models

class NamespaceRecord(models.Model):
    namespace = models.CharField(max_length=100)
    owner = models.CharField(max_length=100)
    cpu_quota = models.CharField(max_length=20)
    memory_quota = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20)

    def __str__(self):
        return self.namespace


