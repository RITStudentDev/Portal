from django.db import models
import uuid
import random
from django.contrib.auth.models import AbstractUser


# at some point set default contact to generate contact value
class AsynkUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    contact = models.CharField(max_length=9, default=None, editable=False, unique=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    #owned_rooms = 

    @classmethod
    def generate_contact(cls, field_name='contact'):
        while True:
            num = f"{random.randint(0, 999999999):09d}"
            if not cls.objects.filter(**{field_name: num}).exists():
                return num

    def save(self, *args, **kwargs):
        if not self.contact:
            self.contact = self.generate_contact()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username