from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import generics, status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Reservation, Facility
from .serializers import ReservationSerializer
import json

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def make_reservation(request): # request should contain: day, slot, facility
    serializer = ReservationSerializer(data=request.data)

    if serializer.is_valid():
        date = serializer.data['date']
        slot = serializer.data['slot']
        facility = serializer.data['facility']

        amt_res = Reservation.objects.filter(date=date, slot=slot, facility=facility, is_active=True).count()
        if amt_res > 0:
            return Response({'title': "Already reserved", 'detail': "This slot is already reserved."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                facility_row = Facility.objects.get(id=facility)
            except:
                return Response({'title': "Invalid facility", 'detail': "Facility does not exist."}, status=status.HTTP_400_BAD_REQUEST)

            reservation = Reservation(date=date, slot=slot, facility=facility_row, reserved_by=request.user)
            reservation.save()
            return Response({'title': "Success", 'detail': "Successfully reserved."}, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def reservation_database_manager(request):
    return JsonResponse({"message": "Hello, World!"})
    #slots_manager(request.GET.get("command", ""))
    #return render(request, "html/reservation_database_manager.html")

def deneme(request):
    return JsonResponse({"message": "Hello, World!"})
    #return HttpResponse('Hello, World!')