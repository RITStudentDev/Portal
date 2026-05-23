from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import MessageSerializer, RoomSerializer, RoomMembershipSerializer, ChannelSerializer
from .models import Room, Message, RoomMembership, Channel
from rest_framework.permissions import IsAuthenticated
from User.views import CookieJWTAuthentication
from django_q.tasks import async_task
from User.models import AsynkUser
import uuid

from .models import Message
from .tasks import process_pending_messages 

class MessageViewSet(viewsets.ViewSet):
    queryset = Message.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]
        
    def create(self, request):
        serializer = MessageSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            message = serializer.save(senderId=request.user)
            task_id = async_task(process_pending_messages, message.messageId)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], url_path='convo/(?P<user_id>[^/.]+)')
    def get_messages(self, request, user_id=None, other_user_id=None):
        from django.db.models import Q

        messages = Message.objects.filter(
            Q(senderId=user_id, receiverId=other_user_id) |
            Q(senderId=other_user_id, receiverId=user_id)
        ).order_by('timestamp')

        serializer = MessageSerializer(messages, many=True)
        return Response({'message': list(messages)})
    
class ChannelViewSet(viewsets.ViewSet):
    queryset = Channel.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]

    # POST /channels/
    def create(self, request):
        serializer = ChannelSerializer(data=request.data, context={'request'})
        if serializer.is_valid():
            channel = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # GET /channels/{channel_id} /messages/
    @action(detail=True, methods=['get'], url_path='messages')
    def get_channel_messages(self, request, pk=None):
        try:
            channel=Channel.objects.get(channel_id=pk)
        except Channel.DoesNotExist:
            return Response({'error': 'Channel not does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        messages = Message.objects.filter(channel=channel).order_by('timestamp')
        serializer = MessageSerializer(messages, many=True)
        return Response({'messages': serializer.data})

    
class RoomViewSet(viewsets.ViewSet):
    queryset = Room.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]
    
    # POST /rooms/
    def create(self, request):
        serializer = RoomSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            room = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # GET /rooms/
    def list(self, request):
        rooms = Room.objects.filter(members=request.user)
        serializer = RoomSerializer(rooms, many=True)
        return Response({'rooms': serializer.data})

    # GET /rooms/{roomId}
    def retrieve(self, request, pk=None):
        try:
            room=Room.objects.get(roomId=pk)
        except Room.DoesNotExist:
            return Response({'error': 'Room not does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        if not room.members.filter(id=request.user.id).exists():
            return Response({'error': 'You are not a memeber of this room'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = RoomSerializer(room)
        return Response(serializer.data)
    
    # GET /rooms/{roomId}/channels/
    @action(detail=True, methods=['get'], url_path='channels')
    def get_channels(self, request, pk=None):
        try:
            room = Room.objects.get(roomId=pk)
        except Room.DoesNotExist:
            return Response({'error': 'Room does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        if not room.members.filter(id=request.user.id).exists():
            return Response({'error': 'You are not a member of this room'}, status=status.HTTP_403_FORBIDDEN)
        
        channels = Channel.objects.filter(parent_room=room)
        serializer = ChannelSerializer(channels, many=True)
        return Response({'channels': serializer.data})

    # POST /rooms/{roomId}/join/  
    @action(detail=True, methods=['post'], url_path='join')
    def join(self, request, pk=None):
        print("request.data:", request.data)

        try:
            room = Room.objects.get(roomId=pk)
            print("room found:", room)
        except Room.DoesNotExist:
            print("room not found")
            return Response({'error': 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        contact = request.data.get('contact')
        print("contact:", contact)

        if not contact:
            print("no contact")
            return Response({'error': 'Contact is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = AsynkUser.objects.get(contact=contact)
            print("user found:", user)
        except AsynkUser.DoesNotExist:
            print("user not found")
            return Response({'error': 'User with that contact not found'}, status=status.HTTP_404_NOT_FOUND)

        if room.members.filter(id=user.id).exists():
            print("already a member")
            return Response({'error': 'User is already a member of this room.'}, status=status.HTTP_400_BAD_REQUEST)
        
        RoomMembership.objects.create(user=user, room=room)
        print("membership created")
        return Response({'success': True}, status=status.HTTP_201_CREATED)
