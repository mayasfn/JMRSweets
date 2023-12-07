var express = require('express');
var router = express.Router();


  router.get('/', function(req, res) {
      res.render('about'); // Renders the 'about' template

  });

  router.post('/', function(req, res) {
    res.render('about');
  }); 
  
  

module.exports = router;
