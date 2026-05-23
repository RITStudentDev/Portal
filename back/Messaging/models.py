from django.db import models
from django.conf import settings
import random
import time
import uuid

def generate_id():
    while True:
        timestamp = str(int(time.time() * 1000))[-8:]
        random_part = str(random.randint(10000000, 99999999))[:8]
        return timestamp + random_part
    
class Room(models.Model):
    roomId = models.CharField(primary_key=True, max_length=16, default=generate_id)
    roomName = models.CharField(max_length=50)
    icon = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True )
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='owned_rooms')
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, through='RoomMembership', related_name='rooms')
    timeCreated = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timeCreated']      

    def __str__(self):
        return f'{self.roomName} ({self.roomId})' 
    
class RoomMembership(models.Model):
    ROLE_CHOICES = [('member', 'Member'), ('admin', 'Admin')]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='member')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'room')

    def __str__(self):
        return f'{self.user} in {self.room}'
    
class Channel(models.Model):
    channel_id = models.CharField(primary_key=True, max_length=16, default=generate_id)
    parent_room = models.ForeignKey('Room', on_delete=models.CASCADE, related_name='channels')
    name = models.CharField(max_length=25, default='New Channel')
    is_default = models.BooleanField(default=False)

class Message(models.Model):

    MESSAGE_STATUS = [
        ('pending', 'Pending'),
        ('queued', 'Queued'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
    ]

    messageId = models.UUIDField(unique=True, primary_key=True, default=uuid.uuid4)
    channel = models.ForeignKey('Channel', on_delete=models.CASCADE, related_name='messages', null=True, blank=True)
    receiverId = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_messages', null=True, blank=True)
    senderId = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    mediaUrl = models.URLField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=MESSAGE_STATUS, default='pending')
    retryCount = models.IntegerField(default=0)
    lastTriedAt = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Message {self.messageId} from {self.senderId} to {self.receiverId }"
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['status', 'timestamp']),
            models.Index(fields=['receiverId', 'status']),
        ]