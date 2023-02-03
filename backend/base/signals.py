from django.db.models.signals import pre_save
from django.contrib.auth.models import User


"""
    for simplicity, we do not override the User model
    from django to use the email insted of the username.
    we just set the username = email 
    and if the email is updated, the username should also 
    be updated, pre_save 
"""
def updateUser(sender, instance, **kwargs):
    user = instance
    if user.email != '':
        user.username = user.email


    
pre_save.connect(updateUser, sender=User)