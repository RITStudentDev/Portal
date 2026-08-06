from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from .serializers import SignupSerializer, UserSerializer
from .models import AsynkUser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
        
class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        raw_token = request.COOKIES.get('access_token')
        if raw_token is None:
            return None
        try:
            validated_token = self.get_validated_token(raw_token)
        except:
            return None
        
        return self.get_user(validated_token), validated_token

class UserViewSet(ModelViewSet):
    queryset = AsynkUser.objects.all()
    authentication_classes = [CookieJWTAuthentication]

    @action(detail=False, methods=["post"])
    def login(self, request):
        serializer = TokenObtainPairSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        access_token = serializer.validated_data['access']
        refresh_token = serializer.validated_data['refresh']

        res = Response({'tokenGenerated': True})

        res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=False,
                samesite='Lax', 
                path='/',
            )

        res.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=False,
            samesite='Lax',
            path='/',
        )

        serializer.is_valid()
        print(serializer.errors)

        return res

    @action(detail=False, methods=['post'])
    def refresh(self, request):

        refresh_token = request.COOKIES.get('refresh_token')

        serializer = TokenRefreshSerializer(data={'refresh': refresh_token})
        serializer.is_valid(raise_exception=True)

        access_token = serializer.validated_data['access']
        res = Response({'tokenRefreshed': True})

        res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/',
            )
        return res
    
    # Use signup serializer only on user creation and user serializer everywhere else
    def get_serializer_class(self):
        if self.action == 'create':
            return SignupSerializer
        return UserSerializer
    
    # Use authentication everywhere except user creation
    def get_permissions(self):
        if self.action in ['create', 'login', 'refresh']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    # Sets queryset to fetch data for only the authenticated user
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return AsynkUser.objects.filter(id=self.request.user.id)
        return AsynkUser.objects.none()

    # Gets authenticated user on device
    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    

    