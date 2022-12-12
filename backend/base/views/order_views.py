from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime

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
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, id):
    order = Order.objects.get(pk=id)

    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()

    return Response('Order was paid')



