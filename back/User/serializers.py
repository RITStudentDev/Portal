from rest_framework import serializers
from .models import AsynkUser
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

# General serializer for user data
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AsynkUser
        fields = ['username', 'email', 'password', 'contact']

# Serializes information in database to be used during user creation
class SignupSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    # Check if entered email is already in use
    def validate_email(self, value):
        if AsynkUser.objects.filter(email=value).exists():
            raise serializers.ValidationError('Account already exists with this email')
        return value
    
    # Check if both entered passwords are the same
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password2': 'Passwords do not match'})
        try:
            validate_password(data['password'])
        except ValidationError as e:
            raise serializers.ValidationError({'password': list(e.messages)})
        return data

    # Add new user to database
    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = AsynkUser(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
    class Meta:
        model = AsynkUser
        fields = ['username', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }
