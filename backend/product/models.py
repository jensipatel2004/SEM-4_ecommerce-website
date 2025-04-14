from django.db import models
from account.models import Account

class Product(models.Model):
    img = models.ImageField(upload_to='product_images/')
    seller = models.ForeignKey(Account, on_delete=models.CASCADE)  
    name = models.CharField(max_length=255)
    distribution = models.TextField()  
    product_price = models.DecimalField(max_digits=10, decimal_places=2)  
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)  
    stock = models.PositiveIntegerField()
    category = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)

    def _str_(self):
        return self.name 
    
class Cart(models.Model):
    user = models.ForeignKey(Account, on_delete=models.CASCADE)  # Associate the cart with a user
    product = models.ForeignKey(Product, on_delete=models.CASCADE)  # The product being added to the cart
    quantity = models.PositiveIntegerField(default=1)  # Quantity of the product

    class Meta:
        unique_together = ('user', 'product')  # Ensure a user can't have the same product in the cart multiple times

    def __str__(self):
        return f"{self.user.name}'s Cart - {self.product.name} (Quantity: {self.quantity})"
    
class Payment(models.Model):
    user = models.ForeignKey(Account, on_delete=models.CASCADE)
    cart_items = models.ManyToManyField(Cart)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    payment_time = models.DateTimeField(auto_now_add=True)