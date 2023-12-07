//imports needed modules used for building and configurating express 
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');
var fileUpload = require('express-fileupload');
var sqlite3 = require('sqlite3').verbose();

//creates an instance of express (to define routes)
var app = express();

// views engine setup : we use pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Configures the SQLite database connection
const dbPath = path.join(__dirname, './data/recipes.db'); // Update the path accordingly
const db = new sqlite3.Database(dbPath);

//indludes route files to handle routes either in index or users
var homeRouter = require('./routes/home');
var aboutRouter = require('./routes/about');
var contactRouter = require('./routes/contact');

//middleware setup
app.use(logger('dev')); //logs info about incoming http requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

//Route setup for our pages
app.use('/', homeRouter);
app.use('/about', aboutRouter);
app.use('/contact', contactRouter);

// express fileupload middleware
app.use(fileUpload());

//serve static files from uploads directory
app.use(express.static('uploads'));
app.use(express.static('public'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // renders the error page
  res.status(err.status || 500);
  res.render('error');
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;

