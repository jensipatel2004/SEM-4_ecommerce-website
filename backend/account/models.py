from django.contrib.auth.hashers import check_password
from django.db import models

class Account(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)  # Added email field with unique constraint
    password = models.CharField(max_length=255)  # Consider hashing passwords
    mobile=models.IntegerField(null=True,blank=True)
    address=models.TextField(null=True,blank=True)
    is_seller = models.BooleanField(default=False)
    def __str__(self):
        return self.name

# models.py
from django.db import models

class ContactSubmission(models.Model):
    user_name = models.CharField(max_length=50)
    user_email = models.EmailField()
    seller_name = models.CharField(max_length=50)
    msg = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.user_name} to {self.seller_name}"
