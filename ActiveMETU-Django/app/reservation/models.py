from django.db import models
from django.utils import timezone

# Create models here.

#def slots_manager(command):
#    if command == "":
#        pass
#    elif command == "delete":
#        Slot.objects.all().delete()
#        return "All slots deleted"
#    elif command == "create":
#        for i in range(1, 8):
#            for j in range(3):
#                slot_id = str(i) + "_0" + str(j+7) + "0"
#                slot = Slot(id=slot_id)
#                slot.save()
#                slot_id = str(i) + "_0" + str(j+7) + "3"
#                slot = Slot(id=slot_id)
#                slot.save()
#            for j in range(3, 15):
#                slot_id = str(i) + "_" + str(j+7) + "0"
#                slot = Slot(id=slot_id)
#                slot.save()
#                slot_id = str(i) + "_" + str(j+7) + "3"
#                slot = Slot(id=slot_id)
#                slot.save()
#        return "All slots created"
#    else:
#        return "Invalid command"

#class Slot(models.Model):
#    id = models.CharField(max_length=5, primary_key=True) # Slot ID in the form "4_153" for 4th day of the week 15.30-16.00  
#    is_available = models.BooleanField(default=True) # True if the slot is available (the slot may be unavailable if the gym got destroyed by godzilla)
#    is_reserved = models.BooleanField(default=False) # True if the slot is reserved
#    reserved_at = models.DateTimeField(null=True) # Time when the slot was reserved
#    reserved_by = models.CharField(max_length=7, null=True) # METU ID of the user who reserved the slot
#
#    def reserve(self, user):
#        if not self.is_available:
#            return 'Unavailable', 'Slot is unavailable.'
#        if self.is_reserved:
#            return 'Already reserved', 'Slot is reserved.'
#        self.is_reserved = True
#        self.reserved_at = timezone.now()
#        self.reserved_by = user
#        self.save()
#        return 'Success', 'Successfully reserved.'
#
#    def unreserve(self):
#        self.is_reserved = False
#        self.reserved_at = None
#        self.reserved_by = None
#        self.save()
#
#    def __str__(self):
#        return "slot" + self.id + " - reserved by " + self.reserved_by

class Directorate(models.Model):
    id = models.IntegerField(primary_key=True) # Directorate ID
    name = models.CharField(max_length=50) # Directorate name

class Facility(models.Model):
    id = models.IntegerField(primary_key=True) # Facility ID, as of 22.12.2024 there are 30 Facilities under 2 Directorates (29 under Sports Directorate, 1 under Pool Directorate)
    directorate = models.ForeignKey('Directorate', on_delete=models.CASCADE) # Directorate where the facility is located
    name = models.CharField(max_length=50) # Facility name

class Reservation(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField(default=timezone.now) # Date of the reservation
    slot = models.IntegerField() # Slot number
    facility = models.ForeignKey('Facility', on_delete=models.CASCADE) # Facility where the reservation is made
    reserved_at = models.DateTimeField(auto_now_add=True) # Time when the reservation was made
    reserved_by = models.ForeignKey('accounts.User', on_delete=models.CASCADE) # User who made the reservation
    is_active = models.BooleanField(default=True) # True if the reservation is active
    is_attended = models.BooleanField(default=False) # True if the reservation is attended