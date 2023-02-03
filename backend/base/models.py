from django.db import models
from django.contrib.auth.models import User



class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=255)
    image = models.ImageField(null=True, blank=True)
    brand = models.CharField(max_length=255, null=True, blank=True)
    category = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1, null=True, blank=True)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    countInStock = models.IntegerField(null=True, blank=True, default=0)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=255, null=True, blank=True)
    rating = models.IntegerField(default=1)
    comment = models.TextField(null=True, blank=True)

    def __str__(self):
        return str(self.rating)


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    paymentMethod = models.CharField(max_length=255, null=True, blank=True)
    productsPrice = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    shippingPrice = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    totalPrice = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(null=True, blank=True)
    isDelivered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.createdAt)


class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=255)
    qty = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    image = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.name

 # ToDo: the shipping price is in the order -> remove from shippingAddress - run migrations
class ShippingAddress(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    postalCode = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    shippingPrice = models.DecimalField(max_digits=8, decimal_places=2, default=0)

    def __str__(self):
        return self.address



