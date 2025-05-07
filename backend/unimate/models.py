from django.db import models
from django.contrib.auth.models import User

class Course(models.Model):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.code} - {self.name}"

class Room(models.Model):
    building = models.CharField(max_length=50)
    number = models.CharField(max_length=20)
    floor = models.IntegerField()
    coordinates = models.JSONField(help_text="3D coordinates for the room")
    
    def __str__(self):
        return f"{self.building} {self.number}"

class Event(models.Model):
    EVENT_TYPES = [
        ('class', 'Class'),
        ('exam', 'Exam'),
    ]
    
    title = models.CharField(max_length=200)
    event_type = models.CharField(max_length=10, choices=EVENT_TYPES)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    lecturer = models.CharField(max_length=100)
    is_urgent = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.title} ({self.get_event_type_display()})"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    rfid_uid = models.CharField(max_length=20, unique=True, blank=True, null=True)
    courses = models.ManyToManyField(Course, through='Enrollment')
    
    def __str__(self):
        return self.user.username

class Enrollment(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    semester = models.CharField(max_length=20)
    
    class Meta:
        unique_together = ('user', 'course', 'semester') 