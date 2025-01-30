from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from events.models import Event
from events.serializers import EventSerializer


def index(request):
    return HttpResponse("Hello, world. You're at the events index.") # TODO: Create a proper view

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_events(request):
    print("this is called")
    events = Event.objects.all()
    serializer = EventSerializer(events, many=True)
    print("Serialized Data:", serializer.data)
    json =  JSONRenderer().render(serializer.data)
    return Response(json)