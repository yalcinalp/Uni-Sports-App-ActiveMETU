from django.db import models

class Event(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=128)
    date_time = models.DateTimeField()
    place = models.CharField(blank=True, max_length=128)
    text = models.TextField(blank=True)
    image = models.ImageField(upload_to='event_images/', blank=True, null=True)
    registration_link = models.URLField(blank=True, null=True)