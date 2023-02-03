from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth.models import User 
from django.contrib.auth.hashers import make_password

from base.serializers import RegisterUserSerializer, UserSerializer, UserSerializerWithToken


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # data['username'] = self.user.username
        # data['email'] = self.user.email 

        serializer = UserSerializerWithToken(self.user).data
        for key, value in serializer.items():
            data[key] = value

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def registerUser(request):
    # validate the input, using RegisterUserSerializer and db validation
    data = request.data
    serializer = RegisterUserSerializer(data=data)
    serializer.is_valid(raise_exception=True)

    try:
        user = User.objects.create(
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            username=data['email'],
            email=data['email'],
            password=make_password(data['password'])
        )
        serializer_with_token = UserSerializerWithToken(user, many=False)
        # if the user was created, return user data and a new access token
        return Response(serializer_with_token.data)
    except:
        message = {'message': 'User with this email already exists.'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)

    data = request.data
    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    user.username = data.get('email', user.email)
    user.email = data.get('email', user.email)

    # only update the password if a new one is provided
    try:
        if data['password'] != '':
            user.password = make_password(data['password'])
    except KeyError:
        pass

    user.save()

    print('--------------------')
    print('user:', user)
    print('lname: ', user.last_name)

    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)