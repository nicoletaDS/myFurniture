from django.urls import path

from base.views import order_views as views


urlpatterns = [
    path('add/', views.addOrderItems, name='orders-add'),
    path('myorders/', views.getMyOrders, name='my-orders'),
    path('<str:id>/', views.getOrderById, name='user-order'),
    path('<str:id>/stripe/create-checkout-session', views.createCheckoutSession, name='checkout-session'),
    path('webhook/', views.stripe_webhook_view, name='webhook-pay'),
]