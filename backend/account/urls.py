from django.urls import path
from .views import SignupView,LoginView, delete_account, get_contact_submissions, get_profile, update_profile
from django.conf import settings
from django.conf.urls.static import static
from . import views
urlpatterns = [
    path('api/signup/', SignupView.as_view(), name='signup'),
    path('api/login/', LoginView.as_view(), name='login'),
    # Other paths...
    path('api/view_profile/', views.view_profile, name='view_profile'),
    path('api/edit_profile/', views.edit_profile, name='edit_profile'),
    path('api/remove_account/', views.remove_account, name='remove_account'),

    path('api/submit/', views.submit_contact_form, name='submit_contact_form'),
    path('api/seller_list/', views.get_seller_list, name='get_seller_list'),

    path('profile/<int:user_id>/', get_profile),
    path('update/<int:user_id>/', update_profile),
    path('delete/<int:user_id>/', delete_account),

    path('contact-submissions/<int:user_id>/', get_contact_submissions, name='contact-submissions'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
