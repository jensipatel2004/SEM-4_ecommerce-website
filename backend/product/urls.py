# urls.py
from django.urls import path
from .views import  checkout_view, related_products
from .views import  cart_count, cart_items
from .views import  add_product, dashboard_stats, get_products_by_seller, update_product,delete_product,update_cart_item,remove_cart_item
from .views import product_list, category_list,product_detail,add_to_cart
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('products/', product_list, name='product-list'),
    path('categories/', category_list, name='category-list'),  # Keep if you want to fetch unique categories
    path('products/<int:pk>/', product_detail, name='product_detail'),
    path('products/', related_products, name='related_products'),
    path('cart/add/', add_to_cart, name='add_to_cart'),
    path('cart/count/<int:user_id>/', cart_count),
    path('cart/items/<int:user_id>/', cart_items),
    path('cart/update/<int:item_id>/', update_cart_item),
    path('cart/remove/<int:item_id>/', remove_cart_item),
    path('checkout/', checkout_view, name='checkout'),  # Use the function
    path('api/dashboard-stats/<int:seller_id>/', dashboard_stats, name='dashboard_stats'),
    path('api/add-product/', add_product, name='add_product'),
    path('api/adminproducts/<int:seller_id>/', get_products_by_seller, name='get_admin_products'),
    path('api/adminproducts/update/<int:product_id>/', update_product, name='update_product'),
    path('api/adminproducts/delete/<int:pk>/',delete_product , name='product-delete'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)