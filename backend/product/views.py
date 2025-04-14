# views.py
import json
from venv import logger
from django.http import JsonResponse
from account.models import Account, ContactSubmission
from product.models import Product,Cart
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import Product

def product_list(request):
    # Filter products by search query, category, and price range if provided
    search_query = request.GET.get('search', '')
    category_filter = request.GET.get('category', '')
    price_range = request.GET.get('price', '')

    products = Product.objects.all()

    if search_query:
        products = products.filter(name__icontains=search_query)

    if category_filter:
        products = products.filter(category__iexact=category_filter)  # Case-insensitive filter

    if price_range:
        if price_range == '10000':
            products = products.filter(selling_price__lt=10000)
        elif price_range == '20000':
            products = products.filter(selling_price__gte=10000, selling_price__lt=20000)
        elif price_range == '30000':
            products = products.filter(selling_price__gte=20000, selling_price__lt=30000)
        elif price_range == '100000':
            products = products.filter(selling_price__gte=30000)

    # Randomize the product list
    products = products.order_by('?')

    return JsonResponse(list(products.values()), safe=False)

def category_list(request):
    # Since category is a CharField in the Product model, we can extract unique categories
    categories = Product.objects.values_list('category', flat=True).distinct()
    return JsonResponse(list(categories), safe=False)

def product_detail(request, pk):
    if request.method == 'GET':
        product = get_object_or_404(Product, pk=pk)
        data = {
            'id': product.id,
            'name': product.name,
            'img': product.img.url,
            'distribution': product.distribution,
            'product_price': str(product.product_price),
            'selling_price': str(product.selling_price),
            'category':product.category,
            'stock': product.stock,
            # 'additional_images': [img.url for img in product.additional_images.all()],  # Make sure this field exists
            'seller': {
                'name': product.seller.name,
                'email': product.seller.email,
                'mobile': product.seller.mobile if hasattr(product.seller, 'mobile') else None,
                'address': product.seller.address if hasattr(product.seller, 'address') else None,
            }
        }
        return JsonResponse(data)

def related_products(request):
    if request.method == 'GET':
        category = request.GET.get('category')
        products = Product.objects.filter(category=category).exclude(id=pk)  # type: ignore # Exclude the current product
        data = [{
            'id': product.id,
            'name': product.name,
            'img': product.img.url,
            'selling_price': str(product.selling_price),
        } for product in products]
        return JsonResponse(data, safe=False)
    

@csrf_exempt
def add_to_cart(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = int(data.get('userId'))
            product_id = int(data.get('productId'))
            quantity = data.get('quantity', 1)

            logger.debug(f"Received data: userId={user_id}, productId={product_id}, quantity={quantity}")

            if not isinstance(user_id, int) or not isinstance(product_id, int):
                return JsonResponse({'error': 'userId and productId must be integers'}, status=400)

            user = Account.objects.get(id=user_id)
            product = get_object_or_404(Product, id=product_id)

            cart_item, created = Cart.objects.get_or_create(user=user, product=product)
            if not created:
                cart_item.quantity += quantity
            else:
                cart_item.quantity = quantity

            cart_item.save()
            return JsonResponse({'message': 'Added to cart successfully!', 'cart_item_id': cart_item.id})

        except json.JSONDecodeError:
            logger.error("JSON decode error", exc_info=True)
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Account.DoesNotExist:
            logger.error(f"Account with ID {user_id} does not exist.")
            return JsonResponse({'error': 'Account not found'}, status=404)
        except Product.DoesNotExist:
            logger.error(f"Product with ID {product_id} does not exist.")
            return JsonResponse({'error': 'Product not found'}, status=404)
        except Exception as e:
            logger.error("Error adding to cart", exc_info=True)
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)


from django.shortcuts import render
from django.http import JsonResponse
from account.models import Account
from product.models import Product

# API for the total count
def dashboard_stats(request,seller_id):
    total_users = Account.objects.count()
    seller=get_object_or_404(Account, id=seller_id)
    total_products = Product.objects.filter(seller=seller).count()
    contact_count= ContactSubmission.objects.filter(seller_name=seller.name).count()

    data = {
        'total_users': total_users,
        'total_products': total_products,
        'total_contact':contact_count
    }
    return JsonResponse(data)


from django.http import JsonResponse
from .models import Product
from account.models import Account
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def add_product(request):
    if request.method == 'POST':
        try:
            # Get user_id and validate it
            user_id = request.POST.get('user_id')
            if not user_id:
                return JsonResponse({'error': 'User ID is missing'}, status=400)
            
            try:
                user = Account.objects.get(id=user_id)
            except Account.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)

            # Retrieve and validate form data
            name = request.POST.get('name')
            distribution = request.POST.get('distribution')
            product_price = request.POST.get('product_price')
            selling_price = request.POST.get('selling_price')
            stock = request.POST.get('stock')
            category = request.POST.get('category')
            brand = request.POST.get('brand')
            img = request.FILES.get('img')  # Handle image

            if not all([name, distribution, product_price, selling_price, stock, category, brand, img]):
                return JsonResponse({'error': 'All fields are required'}, status=400)

            # Create the product
            product = Product.objects.create(
                seller=user,
                name=name,
                distribution=distribution,
                product_price=product_price,
                selling_price=selling_price,
                stock=stock,
                category=category,
                brand=brand,
                img=img  # Save the image file
            )

            return JsonResponse({'success': True, 'message': 'Product added successfully!'})

        except Exception as e:
            # Catch and log the exception
            print(f"Error: {e}")  # This will log the error to the console or Django logs
            return JsonResponse({'error': 'An internal error occurred. Please try again later.'}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)



# views.py

# views.py
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Product, Account  # Make sure to import Account

def get_products_by_seller(request, seller_id):
    # Retrieve the seller or return a 404 error if not found
    seller = get_object_or_404(Account, id=seller_id)

    # Filter products by the single seller instance
    products = Product.objects.filter(seller=seller).values(
        'id', 'name', 'selling_price', 'stock', 'distribution', 
        'category', 'brand', 'img', 'rating'
    )
    
    # Return the products as a JSON response
    return JsonResponse(list(products), safe=False)

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .models import Product

@csrf_exempt
def update_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        data = json.loads(request.body)

        # Update fields based on the incoming data
        product.name = data.get('name', product.name)
        product.selling_price = data.get('selling_price', product.selling_price)
        product.stock = data.get('stock', product.stock)
        product.distribution = data.get('distribution', product.distribution)
        product.category = data.get('category', product.category)
        product.brand = data.get('brand', product.brand)
        # product.rating = data.get('rating', product.rating)

        product.save()
        return JsonResponse({'message': 'Product updated successfully!'}, status=200)
    except Product.DoesNotExist:
        return JsonResponse({'error': 'Product not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Product
@csrf_exempt
def delete_product(request, pk):
    if request.method == 'DELETE':
        product = get_object_or_404(Product, pk=pk)
        product.delete()
        return JsonResponse({'message': 'Product deleted successfully'}, status=204)

    return JsonResponse({'error': 'Method not allowed'}, status=405)





def cart_count(request, user_id):
    count = Cart.objects.filter(user_id=user_id).count()
    return JsonResponse({'count': count})
from django.http import JsonResponse
from .models import Cart
from django.views.decorators.http import require_http_methods
import json


def cart_items(request, user_id):
    user = Account.objects.get(id=user_id)  # Get user details
    items = Cart.objects.filter(user_id=user_id).select_related('product')
    items_list = [
        {
            'id': item.id,
            'product': {
                'name': item.product.name,
                'selling_price': item.product.selling_price,
                'img': item.product.img.url if item.product.img else None,
            },
            'quantity': item.quantity
        } for item in items
    ]
    return JsonResponse({
        'items': items_list,
        'user': {
            'name': user.name,
            'email': user.email,
            'mobile': user.mobile,
            'address': user.address,
        }
    })

@csrf_exempt
@require_http_methods(["PATCH"])
def update_cart_item(request, item_id):
    try:
        body = json.loads(request.body)
        quantity = body.get('quantity')

        if quantity is None or quantity <= 0:
            return JsonResponse({'error': 'Invalid quantity'}, status=400)

        cart_item = Cart.objects.get(id=item_id)
        product = Product.objects.get(id=cart_item.product_id)  # Assuming there's a ForeignKey

        if quantity > product.stock:
            return JsonResponse({'error': 'Insufficient stock'}, status=400)

        cart_item.quantity = quantity
        cart_item.save()
        return JsonResponse({'success': True})

    except Cart.DoesNotExist:
        return JsonResponse({'error': 'Item not found'}, status=404)
    except Product.DoesNotExist:
        return JsonResponse({'error': 'Product not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

@csrf_exempt
@require_http_methods(["DELETE"])
def remove_cart_item(request, item_id):
    try:
        cart_item = Cart.objects.get(id=item_id)
        cart_item.delete()
        return JsonResponse({'success': True})

    except Cart.DoesNotExist:
        return JsonResponse({'error': 'Item not found'}, status=404)
    
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
import json
from .models import Account, Cart, Payment
@csrf_exempt
def checkout_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data['user_id']
            cart_items_data = data['cart_items']
            total_price = data['total_price']

            # Fetch user
            user = get_object_or_404(Account, id=user_id)

            # Create a payment record
            payment = Payment.objects.create(user=user, total_price=total_price)

            for item in cart_items_data:
                cart_item = get_object_or_404(Cart, id=item['id'])
                
                # Fetch the product associated with the cart item
                product = cart_item.product
                
                # Check if the quantity in the cart is greater than the product stock
                if cart_item.quantity > product.stock:
                    return JsonResponse({'error': 'Insufficient stock for product: ' + product.name}, status=400)

                # Decrease product stock
                product.stock -= cart_item.quantity
                product.save()  # Save the updated product stock

                # Add the cart item to the payment record
                payment.cart_items.add(cart_item)

            payment.save()

            # Clear the user's cart after payment
            Cart.objects.filter(user=user).delete()

            return JsonResponse({'message': 'Payment successful!', 'payment_id': payment.id}, status=201)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method.'}, status=405)
