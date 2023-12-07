const fs = require('fs');
const csv = require('csv-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Spécifiez le chemin vers votre fichier CSV et votre base de données SQLite
const csvFilePath = './recipes.csv';
const dbFilePath = './recipes.db';

// Fonction pour créer une connexion à la base de données SQLite
const db = new sqlite3.Database(dbFilePath);
//create table
db.run(`CREATE TABLE IF NOT EXISTS "recipes" (
    "Title" TEXT,
    "Directions" TEXT,
    "Quantity" TEXT,
    "Unit01" TEXT,
    "Ingredient01" TEXT,
    "Quantity02" TEXT,
    "Unit02" TEXT,
    "Ingredient02" TEXT,
    "Quantity03" TEXT,
    "Unit03" TEXT,
    "Ingredient03" TEXT,
    "Quantity04" TEXT,
    "Unit04" TEXT,
    "Ingredient04" TEXT,
    "Quantity05" TEXT,
    "Unit05" TEXT,
    "Ingredient05" TEXT,
    "Quantity06" TEXT,
    "Unit06" TEXT,
    "Ingredient06" TEXT,
    "Quantity07" TEXT,
    "Unit07" TEXT,
    "Ingredient07" TEXT,
    "Quantity08" TEXT,
    "Unit08" TEXT,
    "Ingredient08" TEXT,
    "Quantity09" TEXT,
    "Unit09" TEXT,
    "Ingredient09" TEXT,
    "Quantity10" TEXT,
    "Unit10" TEXT,
    "Ingredient10" TEXT,
    "Quantity11" TEXT,
    "Unit11" TEXT,
    "Ingredient11" TEXT,
    "Quantity12" TEXT,
    "Unit12" TEXT,
    "Ingredient12" TEXT,
    "Quantity13" TEXT,
    "Unit13" TEXT,
    "Ingredient13" TEXT,
    "Quantity14" TEXT,
    "Unit14" TEXT,
    "Ingredient14" TEXT,
    "Quantity15" TEXT,
    "Unit15" TEXT,
    "Ingredient15" TEXT,
    "Quantity16" TEXT,
    "Unit16" TEXT,
    "Ingredient16" TEXT,
    "Quantity17" TEXT,
    "Unit17" TEXT,
    "Ingredient17" TEXT,
    "Quantity18" TEXT,
    "Unit18" TEXT,
    "Ingredient18" TEXT,
    "Quantity19" TEXT,
    "Unit19" TEXT,
    "Ingredient19" TEXT,
    "Category" TEXT
    );
    `,(err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Table created or it already exists');
        }
    


    // Close the database connection
    //db.close();
    });
   

// Tableau pour stocker les données CSV
const data = [];

// Lire le fichier CSV et parser les lignes
fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
        // Ajouter chaque ligne au tableau de données
        data.push(row);
    })
    .on('end', () => {
        // Appeler la fonction pour insérer les données dans la base de données
        insertData(data);
    });

// Fonction pour insérer les données dans la table recipes
function insertData(data) {
    const insertQuery = 'INSERT INTO recipes (Title, Directions,  Quantity ,Unit01  , Ingredient01, Quantity02, Unit02, Ingredient02,Quantity03,Unit03, Ingredient03, Quantity04, Unit04,Ingredient04, Quantity05,Unit05,Ingredient05, Quantity06, Unit06, Ingredient06,Quantity07, Unit07,Ingredient07,Quantity08, Unit08,Ingredient08,Quantity09,Unit09, Ingredient09, Quantity10,Unit10,Ingredient10, Quantity11,Unit11,Ingredient11,Quantity12,Unit12,Ingredient12,Quantity13, Unit13,Ingredient13,Quantity14,Unit14,Ingredient14,Quantity15,Unit15,Ingredient15, Quantity16,Unit16,Ingredient16,Quantity17, Unit17, Ingredient17,Quantity18,Unit18,Ingredient18,Quantity19,Unit19,Ingredient19,Category) VALUES (?, ?, ?, ?, ?, ?,?,?,?,?, ?, ?, ?, ?, ?, ?,?,?,?,?, ?, ?, ?, ?, ?, ?,?,?,?,?,?, ?, ?, ?, ?, ?,?,?,?,?,?, ?, ?, ?, ?, ?,?,?,?,?,?, ?, ?, ?, ?, ?,?,?,?,?)';

    // Commencer la transaction
    db.serialize(() => {
        console.log('hello debut');
        // Préparer la requête SQL
        const stmt = db.prepare(insertQuery);

        // Insérer chaque ligne de données dans la base de données
        data.forEach(row => {
            console.log('debut du foreach');
            // Convertir les objets CSV en tableau de valeurs
            const values = Object.values(row);
            stmt.run(values);
            console.log('fin du foreach');
        });
        console.log('fin');

        // Finaliser la transaction
        stmt.finalize();

        // Fermer la connexion à la base de données
        db.close();
    });
}
