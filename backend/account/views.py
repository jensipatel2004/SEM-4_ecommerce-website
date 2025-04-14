from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import Account
import json
from django.contrib.auth.hashers import make_password

@method_decorator(csrf_exempt, name='dispatch')
class SignupView(View):
    def post(self, request):  # Correct method signature
        try:
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            password = data.get('password')
            is_seller = data.get('is_seller')

            if Account.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Email already exists.'}, status=400)

            account = Account.objects.create(name=name, email=email, password=password , is_seller=is_seller)
            return JsonResponse({'id': account.id, 'name': account.name, 'email': account.email}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    def options(self, request):  # This handles OPTIONS requests
        return JsonResponse({'status': 'ok'}, status=200)


from django.views import View
@method_decorator(csrf_exempt, name='dispatch')
class LoginView(View):
    def post(self, request):
        try:
            data = json.loads(request.body) 
            email = data.get('email')
            password = data.get('password')
            is_seller = data.get('seller', False)  # Get seller flag from request

            # Check if the account exists and if the seller flag matches
            account = Account.objects.filter(email=email, is_seller=is_seller).first()  # Filter by is_seller
            if account and account.password == password:  # Check the password
                response_data = {
                    'id': account.id,
                    'name': account.name,
                    'message': "Login successful"
                }
                return JsonResponse(response_data, status=200)
            else:
                return JsonResponse({'error': 'Invalid email or password.'}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON.'}, status=400)
        except Exception as e:
            print("Error:", str(e))  # Log the error
            return JsonResponse({'error': 'Internal Server Error'}, status=500)
    

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import check_password, make_password
from django.shortcuts import get_object_or_404
from .models import Account
import json

# View profile
def view_profile(request):
    if request.method == 'GET':
        user_id = request.GET.get('user_id')  # Assume user ID is passed in the URL
        account = get_object_or_404(Account, id=user_id)
        data = {
            'name': account.name,
            'email': account.email,
            'mobile': account.mobile,
            'address': account.address,
            'is_seller': account.is_seller,
        }
        return JsonResponse(data)

# Edit profile
@csrf_exempt
def edit_profile(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_id = data.get('user_id')
        account = get_object_or_404(Account, id=user_id)
        
        account.name = data.get('name', account.name)
        account.mobile = data.get('mobile', account.mobile)
        account.address = data.get('address', account.address)
        
        if data.get('password'):
            account.password = make_password(data['password'])  # Hashing password
        
        account.save()
        return JsonResponse({'message': 'Profile updated successfully'})

# Remove account
@csrf_exempt
def remove_account(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_id = data.get('user_id')
        account = get_object_or_404(Account, id=user_id)
        account.delete()
        return JsonResponse({'message': 'Account removed successfully'})

# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import ContactSubmission, Account
import json

@csrf_exempt
def submit_contact_form(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        ContactSubmission.objects.create(
            user_name=data['user_name'],
            user_email=data['user_email'],
            seller_name=data['seller_name'],
            msg=data['msg']
        )
        return JsonResponse({'message': 'Your message has been submitted successfully!'})
    return JsonResponse({'error': 'Invalid request method'}, status=400)


from django.http import JsonResponse
from .models import ContactSubmission
from account.models import Account  # Assuming Account model is in the 'account' app

# View to get contact submissions for a specific seller (user_id)
def get_contact_submissions(request, user_id):
    try:
        # Get the seller's name based on the user_id
        seller = Account.objects.get(id=user_id)
        seller_name = seller.name  # Assuming the Account model has a 'name' field
        
        # Filter contact submissions where seller_name matches
        submissions = ContactSubmission.objects.filter(seller_name=seller_name)
        
        # Create a list of dictionaries to send as JSON response
        submissions_data = list(submissions.values(
            'id', 'user_name', 'user_email', 'seller_name', 'msg', 'submitted_at'
        ))
        
        # Return data as JSON
        return JsonResponse(submissions_data, safe=False)

    except Account.DoesNotExist:
        return JsonResponse({'error': 'Seller not found'}, status=404)


# Fetch sellers with is_seller=True
def get_seller_list(request):
    sellers = Account.objects.filter(is_seller=True)
    seller_list = [{'id': seller.id, 'name': seller.name} for seller in sellers]
    return JsonResponse(seller_list, safe=False)



from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Account
import json

@csrf_exempt
def get_profile(request, user_id):
    try:
        account = Account.objects.get(id=user_id)
        return JsonResponse({
            'name': account.name,
            'email': account.email,
            'mobile': account.mobile,
            'address': account.address
        })
    except Account.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

@csrf_exempt
def update_profile(request, user_id):
    if request.method == 'PUT':
        try:
            account = Account.objects.get(id=user_id)
            data = json.loads(request.body)
            account.name = data.get('name', account.name)
            account.email = data.get('email', account.email)
            account.mobile = data.get('mobile', account.mobile)
            account.address = data.get('address', account.address)
            account.save()
            return JsonResponse({'success': True})
        except Account.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def delete_account(request, user_id):
    if request.method == 'DELETE':
        try:
            account = Account.objects.get(id=user_id)
            account.delete()
            return JsonResponse({'message': 'Account deleted successfully'})
        except Account.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
