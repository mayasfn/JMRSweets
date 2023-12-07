const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

function readIngredientsFile(filePath) {
    try {
        const ingredientsContent = fs.readFileSync(filePath, 'utf-8');
        // Divide the content into lines and remove unnecessary spaces
        // Divide the content into lines and remove unnecessary spaces
        const ingredientsArray = ingredientsContent.split('\n').map(line => line.trim()).filter(Boolean);
        return ingredientsArray;
    } catch (error) {
        console.error('Error reading ingredients file:', error);
        throw error;
    }
}

function searchRecipes(callback) {
    try {
        const dbFilePath = path.join(__dirname, './recipes.db');
        const db = new sqlite3.Database(dbFilePath);

        const ingredientsFilePath = path.join(__dirname, '../ingredients.txt');
        const ingredientsArray = readIngredientsFile(ingredientsFilePath);
        console.log(ingredientsArray);

    let whereConditions = ingredientsArray.map(ingredient => `AllIngredients LIKE '%${ingredient}%'`);
    let whereClause = whereConditions.join(' OR ');

    let sqlQuery = `
    SELECT Title, Category, AllIngredients, Directions, AllRecipe,
    (${ingredientsArray.map(ingredient => `CASE WHEN AllIngredients LIKE '%${ingredient}%' THEN 1 ELSE 0 END`).join(' + ')}) AS MatchCount,
    NumIngredients - (${ingredientsArray.map(ingredient => `CASE WHEN AllIngredients LIKE '%${ingredient}%' THEN 1 ELSE 0 END`).join(' + ')}) AS MissingCount
FROM recipes 
WHERE ${whereClause} 
GROUP BY Title, Category, AllIngredients, Directions, AllRecipe
ORDER BY MissingCount ASC, MatchCount DESC
LIMIT 3;

`;
        // Execute the SQL query
        db.all(sqlQuery, (err, rows) => {            
            if (err) {
                // Log the error with detailed information
                console.error('Error executing the query:', err);
                console.error('Failed SQL query:', sqlQuery);
                // Pass the error to the callback
                callback(err);
                return;
            }

            // Log the results for debugging
            console.log('Search results:', rows);

            // Invoke the callback with the search results
            callback(null, rows);
            db.close((closeErr) => {
                if (closeErr) {
                    console.error('Error closing database:', closeErr.message);
                } else {
                    console.log('Disconnected from the database');
                }
            });
        });
    } catch (error) {
        // Log any unexpected errors
        console.error('Unexpected error in searchRecipes:', error);
        callback(error);
    }
}

module.exports = {
    searchRecipes,
};
