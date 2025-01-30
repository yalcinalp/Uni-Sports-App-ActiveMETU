from rest_framework import serializers

class EventSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=128)
    date_time = serializers.DateTimeField()
    place = serializers.CharField(max_length=128)
    text = serializers.CharField(max_length=512)
    image = serializers.ImageField()
    registration_link = serializers.URLField()