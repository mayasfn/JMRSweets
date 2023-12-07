
# Name
JMRSweets.

# Description
Our website enables you to upload pictures of ingredients already at your disposal, to create yummy desserts.Using the model ResNet18 that we trained ourselves to recognize 14 ingredients using Pytorch,  and an important database of dessert recipes, our system analyses these images, recognizes the ingredients of these pictures and generates recipes accordingly using SQL queries. You no longer need to search through cookbooks or websites for dessert ideas. JMRSweets takes care of it all for you.


# Project architecture



## data/
- contains the recipe database, the files that modify it, and the query to generate recipes.


## public/
- Contains publicly accessible static files such as images or stylesheets.

- Client-side JavaScript is included here.

## training/
- Python scripts related to AI training.

    - **Dataloader.py:**
      - Loads the data.

    - **train.py:**
      - Performs training of the model on the dataset.
      - Defines classes (e.g., 5 images = 5 files).
      - Batch size: The number of photos ResNet reads at once.
      - Number of epochs: The number of times the dataset is traversed.
      - Learning rate: The lower, the more accurate the training, but also longer.
      - Training loop.
      - Saves all training weights in a .pth file.
      - Number of memory losses at the end of training.

    - **evaluate.py:**
      - Similar to train but on a smaller dataset for evaluation to validate the accuracy of the training.

    - **fruits.pth:**
      - Training weights used in fruits.py.

    - **fruits.py:**
      - Executed on the site when the button submit is clicked.
      - Takes the photo uploaded on the site, transforms it into a dimension ResNet 18 can recognize.
      - Analyzes to recognize which class the image belongs to.

## routes/
- Express.js route handler.

    - **home.js:**
      - Routes related to the homepage.

## views/
- Pug templates.

    - **layout.pug:**
      - Main layout template.

## app.js:
- The main entry point for your Node.js/Express application.

## package.json:
- Manages project dependencies.

# Installation


Extensions needed on VSCode to read the .db file:

- SQLite3 editor
- SQLite
- SQL server
- SQL bindings
- SQL database projects
- Rainbow CSV



# Project Launch

## 1. Clone the Repository:
 ```bash
 git clone https://forge.univ-lyon1.fr/p2102583/jsmrecipes.git
```
## 2. Installing Pytorch
download Pytorch on the website https://pytorch.org

## 3. Get to your directory:
 ```bash
 cd jsmrecipes
```
## 4. Install Dependencies:
 ```bash
 npm install
```
## 5. Run the Application:
 ```bash
 npm start
```

## 6. Explore the Website
 After executing these commands in your terminal, the application will be accessible at http://localhost:3000

## 7. Close the project
When you're done using the website, you can quit the npm start that is running on your terminal
by simply pressing "Ctrl+C" on your keyboard.


# Authors and acknowledgment
Group members:
- Roudy KARAM (p2018275)
- Maya SOUFAN (p2102583)
- Jane AZIZ (p2102430)
- Sarra MEJRI (p2101522)

Grateful for the collaboration within our group, we thrived on sharing our knowledge and supporting each other throughout the project. Special thanks to our two mentors Mr. Alexandre Meyer and Mr. Rémy Cazabet for their invaluable guidance.



