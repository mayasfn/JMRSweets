from PIL import Image
from model import IngredientsClassifier
import torchvision.transforms as transforms
import torch
import os
import glob
import json

def predict_image(image_file) : 

    if image_file:
     # Loads the image using the constructed path
        image = Image.open(image_file)
        # Converts the image to RGB format if it's not already colored
        if image.mode != 'RGB':
            image = image.convert('RGB')
        # Transformations for image preprocessing
        transform = transforms.Compose([
            transforms.Resize(224),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])

        # Applies transformations to images
        input_image = transform(image).unsqueeze(0)  

    
        # Specify the image file name
        image_fil = 'ingredients_classifier.pth'

        # Construct the full path to the image file
        image_pat = os.path.join(script_dir, image_fil)
        model_checkpoint = image_pat #'training/fruits_classifier.pth'
        model = IngredientsClassifier(num_classes=14)  # Assurez-vous d'utiliser les mêmes paramètres que lors de l'entraînement
        model.load_state_dict(torch.load(model_checkpoint))
        model.eval()


        # Makes the prediction
        with torch.no_grad():
            outputs = model(input_image)
            _, predicted = torch.max(outputs, 1)

        # Interprets the predictions for the classes 

        if predicted.item()== 0:
            return "apple"
        elif predicted.item()== 1:
            return "banana"   
        elif predicted.item()== 2:
            return "carrot"
        elif predicted.item() == 3:
            return "chocolate"
        elif predicted.item()==4:
            return "cocoa"
        elif predicted.item() == 5:
            return "egg"
        elif predicted.item() ==6:
            return "flour"
        elif predicted.item() == 7:
            return "ice cream"
        elif predicted.item() == 8:
            return "lemon"
        elif predicted.item() == 9:
            return "milk"
        elif predicted.item() == 10:
            return "orange"
        elif predicted.item() == 11:
            return "pear"
        elif predicted.item() == 12:
            return "pineapple"
        elif predicted.item() == 13:
            return "strawberries"            
    
    else:
        print("Aucune image trouvée dans le répertoire 'uploads'.")


        

script_dir = os.path.dirname(os.path.abspath(__file__))

# Takes the absolute path of "uploads" directory 
upload_dir = os.path.join(script_dir, '../uploads')

image_file = None

image_files = glob.glob(os.path.join(upload_dir, '*.jpeg')) or glob.glob(os.path.join(upload_dir, '*.jpg')) or glob.glob(os.path.join(upload_dir, '*.png'))

ingredientsArray = [predict_image(image_file) for image_file in image_files]
print(json.dumps(ingredientsArray))
