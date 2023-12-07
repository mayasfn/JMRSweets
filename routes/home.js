var express = require('express');
var router = express.Router();
const multer = require('multer'); //used for file uploads 
const { exec } = require('child_process'); //used for our python script
const path = require('path'); //used to get absolute paths
const fs = require('fs'); //allows file system operations to be perfomed (used to check if folder exists)




//handle get 
router.get('/', function (req, res) {
    res.render('home'); 
  });


// handle post 
router.post('/', function(req, res) {
  res.render('home');
}); 


//Handles image upload 

const upload_directory = 'uploads';

// if uploads folder doesn't exist, creates it
if (!fs.existsSync(upload_directory)) {
  fs.mkdirSync(upload_directory);
}

// Multer configuration for file uploads (configuration destination (uploads) and filenaming)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, upload_directory); // Store uploaded files in the public/uploads directory
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

//initializes multer with the configurations (we defined up)
const upload = multer({ storage: storage });

// handles post request to upload images
router.post('/upload', upload.array('images', 10), function(req, res) {
  // `req.files` : has info about the uploaded files
  // to get first uploaded file name : const firstFileName = req.files[0].filename;
  res.json({ message: 'Files uploaded successfully!' });
});

//Handles python execution 
router.get('/run-and-clear-uploads', (req, res) => {
  const scriptPath = path.join(__dirname, '../training/fruits.py');
  const outputPath = path.join(__dirname, '../ingredients.txt');

  //handles image ingredients part
  exec(`python ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erreur : ${error}`);
      return res.status(500).send('Erreur lors de l\'exécution du script Python.');
    }

    // Process the output before appending to test.txt
    const items = JSON.parse(stdout);
    const content = items.join('\n') + '\n';

    // Append the processed content to test.txt
    fs.appendFile(outputPath, content, (err) => {
      if (err) {
        console.error('Error appending to file:', err);
        return res.status(500).send('Error appending to file.');
      }

      // Deletes content of uploads folder
      fs.readdir(upload_directory, (err, files) => {
        if (err) {
          console.error(`Error while accessing uploads folder : ${err}`);
          return res.status(500).send('Error while deleting files from uploads.');
        }

        files.forEach(file => {
          const filePath = path.join(upload_directory, file);
          fs.unlinkSync(filePath); //Deletes every file from uploads
        });

        res.json({ result: items, message: 'Images deleted successfully!' });
      });
    });
  });

});

//handles checked ingredients part
router.post('/submit-ingredients', (req, res) => {
  console.log('Request received:', req.body);

  // Check if req.body.ingredients is an array
  if (!Array.isArray(req.body.ingredients)) {
    console.error('Invalid request format. Expected an array.');
    return res.status(400).json({ error: 'Invalid request format' });
  }

  const filePath = path.join(__dirname, '../ingredients.txt');
  const content = req.body.ingredients.join('\n') + '\n';

  console.log('Content to be appended:', content);

  fs.appendFile(filePath, content, (err) => {
    if (err) {
      console.error('Error appending to file:', err);
      return res.status(500).json({ error: 'Error writing to file' });
    } else {
      console.log('Content has been appended to the file successfully!');
      res.json({ success: true });
    }
  });
});

  
router.post('/search-recipes', (req, res) => {
  const generatedRecipes = path.join(__dirname, '../data/recipes.js');
  const recipesLogic = require(generatedRecipes);

  recipesLogic.searchRecipes((err, rows) => {
    if (err) {
      console.error('Error searching recipes:', err);
      console.log('Request Body:', req.body);
      console.log('Request Headers:', req.headers);
      return res.status(500).json({ error: 'Internal Server Error', details: err });
    }

    if (req.xhr) {
      // If the request is AJAX, send JSON data
      return res.json({ recipes: rows });
    } 
  });
});

router.post('/clear-ingredients-file', (req, res) => {
  const filePath = path.join(__dirname, '../ingredients.txt');

  // Clear the content of ingredients.txt
  fs.writeFile(filePath, '', (err) => {
    if (err) {
      console.error('Error clearing ingredients.txt:', err);
      return res.status(500).json({ error: 'Error clearing ingredients.txt' });
    }

    res.json({ success: true });
  });
});

module.exports = router;


