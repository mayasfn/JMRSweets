const fs = require('fs');
const csv = require('csv-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Specify the path to your CSV file and your SQLite database
const csvFilePath = './recipes.csv';
const dbFilePath = './recipes.db';

// Function to create a connection to the SQLite database
const db = new sqlite3.Database(dbFilePath);

// Update the "NumIngredients" column with the count of ingredients
db.run(`
  UPDATE recipes
  SET NumIngredients = LENGTH(AllIngredients) - LENGTH(REPLACE(AllIngredients, ';', ''));
`, function(err) {
  if (err) {
    console.error('Error updating column:', err);
  } else {
    console.log('NumIngredients column updated successfully.');
  }

  // Close the database connection
  db.close();
});
