from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from datetime import datetime
import stripe
from django.conf import settings
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

from base.models import Product, Order, OrderItem, ShippingAddress
from base.serializers import OrderSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data
    orderItems = data['orderItems']

    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    else:

        # 1. Create order

        order = Order.objects.create(
            user=user,
            paymentMethod=data['paymentMethod'],
            productsPrice=data['itemsPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice']
        )

        # 2. Create shipping address

        shipping = ShippingAddress.objects.create(
            order=order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            postalCode=data['shippingAddress']['postalCode'],
            country=data['shippingAddress']['country']
        )

        # 3. Create order items and set orderItem relationship

        for item in orderItems:
            product=Product.objects.get(pk=item['product'])

            OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=item['qty'],
                price=item['price'],
                image=product.image.url
            )

            # 4. Update product countInStock
            product.countInStock -= item['qty']
            product.save()

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, id):

    user = request.user

    try:
        order = Order.objects.get(pk=id)
        if order.user == user or order.is_staff:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return Response({'detail': 'Not authorized to view this order'}, 
            status=status.HTTP_400_BAD_REQUEST)
    except:

        return Response({'detail': 'Order does not exist'},
        status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def updateOrderToPaid(request, id):
    order = Order.objects.get(pk=id)

    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()

    return Response('Order was paid')


@api_view(['POST'])
def createCheckoutSession(request, id):

    order = Order.objects.get(pk=id)
    orderItems = order.orderitem_set.all()
    items = []

    for orderItem in orderItems:
        element = {
            "price_data": {
                "currency": "ron",
                "product_data": {
                    "name": orderItem.name,
                    },
                "unit_amount": int(orderItem.price * 100),
            },
            "quantity": orderItem.qty,
        }
        items.append(element)

    stripe.api_key = settings.STRIPE_SECRET_KEY

    try:
        checkout_session = stripe.checkout.Session.create(
                line_items = items,
                payment_method_types=['card',],
                mode='payment',
                success_url=f"{settings.SITE_URL}/orders/{id}?success=true",
                cancel_url=f"{settings.SITE_URL}/orders/{id}?canceled=true",
            )
        return redirect(checkout_session.url)

    except:
        return Response(
            {'error': 'Something went wrong when creating stripe checkout session'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# @csrf_exempt
# def stripe_webhook_view(request):

#     # Stripe CLI webhook secret for testing the endpoint locally.
#     endpoint_secret = settings.ENDPOINT_SECRET

#     # use request.body instead of request.data, because request.data in drf is parsed
#     # and the signature verifier can't verify the payload 
#     # so the payload need to be in a raw form => request.body
#     payload = request.body
#     event = None
#     sig_header = request.META['HTTP_STRIPE_SIGNATURE']

#     try:
#         event = stripe.Event.construct_event(
#             payload, sig_header, endpoint_secret
#         )
#     except ValueError as e:
#         # Invalid payload
#         return HttpResponse(status=400)
#     except stripe.error.SignatureVerificationError as e:
#         # Invalid signature
#         return HttpResponse(status=400)

#     print('--------EVENT----------')
#     print(event)

#     # event success handler
#     if event['type'] == 'checkout.session.completed':
#       session = event['data']['object']
#       # TODO: get the id from session.data and update_order_to_paid(id)
#       print('----------------SESION------------------')
#       print(session)
#     else:
#       print('Unhandled event type {}'.format(event['type']))

#     return HttpResponse(status=200)

    
# Using Django
@csrf_exempt
def stripe_webhook_view(request):
    # TODO: update order to isPaid
    payload = request.body
    event = None
    stripe.api_key = settings.STRIPE_SECRET_KEY

    try:
        event = stripe.Event.construct_from(
        payload, stripe.api_key
        )
    except ValueError as e:
        print('EXCEPT VALUE ERROR-----')
        # Invalid payload
        return HttpResponse(status=400)

    print('--------EVENT-------')
    print(event)

    # Handle the event
    if event.type == 'payment_intent.succeeded':
        payment_intent = event.data.object # contains a stripe.PaymentIntent
        # Then define and call a method to handle the successful payment intent.
        # handle_payment_intent_succeeded(payment_intent)
    elif event.type == 'payment_method.attached':
        payment_method = event.data.object # contains a stripe.PaymentMethod
        # Then define and call a method to handle the successful attachment of a PaymentMethod.
        # handle_payment_method_attached(payment_method)
    # ... handle other event types
    else:
        print('Unhandled event type {}'.format(event.type))

    return HttpResponse(status=200)





