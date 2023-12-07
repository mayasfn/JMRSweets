import os
import torch
from torchvision import transforms
from torchvision.datasets import ImageFolder
from torch.utils.data import DataLoader

# path to the image dataset 
data_dir = 'ingredients_dataset'  

#  Implements needed transformations for the pretreatment of images
transform = transforms.Compose([
    transforms.Resize(224),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Creates datasets for training and testing 
train_dataset = ImageFolder(os.path.join(data_dir, 'train'), transform=transform)
test_dataset = ImageFolder(os.path.join(data_dir, 'test'), transform=transform)

# Data loaders for training and testing with a defined  batch size
batch_size = 32  
train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=batch_size)
