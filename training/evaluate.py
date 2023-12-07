import torch
import torchvision.transforms as transforms
from torch.utils.data import DataLoader
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from torchvision.datasets import ImageFolder  
from model import IngredientsClassifier  

# Path of our pretrained model
model_checkpoint = 'ingredients_classifier.pth'

# Transformations needed for the data
transform = transforms.Compose([
    transforms.Resize(224),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Load the data (done with ImageFolder) and create a DataLoader object 
test_dataset = ImageFolder(root='ingredients_dataset/test', transform=transform)

test_loader = DataLoader(test_dataset, batch_size=32, shuffle=False)

# Pretrained model loaded
model = IngredientsClassifier(num_classes=14)  
model.load_state_dict(torch.load(model_checkpoint))
model.eval() # model put in mode "eval"

# Lists to store predicted labels and real labels 
predicted_labels = []
true_labels = []

# Goes through the data in "test" and makes its predictions 
with torch.no_grad():
    for images, labels in test_loader:
        outputs = model(images)
        _, predicted = torch.max(outputs, 1)
        predicted_labels.extend(predicted.tolist())
        true_labels.extend(labels.tolist())

# Calculates the precision of the prediction
accuracy = accuracy_score(true_labels, predicted_labels)
print(f'Accuracy: {accuracy:.2f}')

# Displays the classification report
print(classification_report(true_labels, predicted_labels))

# Displays the confusion matrix 
confusion = confusion_matrix(true_labels, predicted_labels)
print('Confusion Matrix:')
print(confusion)
