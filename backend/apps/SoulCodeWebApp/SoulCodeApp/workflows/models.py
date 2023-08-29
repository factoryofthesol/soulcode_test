from django.db import models

class Hash(models.Model):
    ID = models.CharField(max_length=100)
    Input = models.CharField(max_length=100)
    Tags = models.CharField(max_length=100)

class data(models.model):
    Type = models.CharField(max_length=100)
    id = models.CharField(max_length=100)
    Setting_Group = models.CharField(max_length=100)
    Summary  = models.CharField(max_length=100)




def __str__(self):
    return self.ID