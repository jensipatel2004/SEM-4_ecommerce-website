from django.contrib import admin
from product.models import Product,Cart,Payment
# Register your models here.
admin.site.register(Product)
admin.site.register(Cart)
admin.site.register(Payment)
