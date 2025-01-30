from rest_framework import serializers
from django.utils import timezone
from datetime import datetime
from .models import Facility

class ReservationSerializer(serializers.Serializer):
    date = serializers.DateField() # Date of the reservation 
    slot = serializers.CharField(max_length=3) # 07:00 -> 070, 07:30 -> 073
    facility = serializers.IntegerField() # Facility ID, should be less than 30

    def validate(self, data):
        # Validate date
        try:
            if data['date'] < timezone.now().date():
                raise serializers.ValidationError({'date': 'Date must be in the future'})
        except ValueError:
            raise serializers.ValidationError({'date': 'Invalid date format'})

        # Validate slot
        try:
            if len(data['slot']) != 3:
                raise serializers.ValidationError({'slot': 'Slot must be 3 digits'})

            hours = int(data['slot'][:2])
            minutes = int(data['slot'][2])
            
            if not (0 <= hours <= 23):
                raise serializers.ValidationError({'slot': 'Hours must be between 00 and 23'})
            
            if minutes not in [0, 3]:  # 0 for :00, 3 for :30
                raise serializers.ValidationError({'slot': 'Minutes must be either 00 or 30'})
        except ValueError:
            raise serializers.ValidationError({'slot': 'Invalid slot format'})
        
        # Validate facility
        try:
            facility_id = int(data['facility'])
            if not (1 <= facility_id <= Facility.objects.all().count()): # There are 30 Facilities under 2 Directorates (29 under Sports Directorate, 1 under Pool Directorate)
                raise serializers.ValidationError({'facility': 'Invalid facility ID'})
        except ValueError:
            raise serializers.ValidationError({'facility': 'Invalid facility ID'})

        return data