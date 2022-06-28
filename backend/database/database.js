const mysql = require("mysql")

// Création de la connexion avec la BDD
const database = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : "groupomania"
  },
  console.log("Connecté à la BDD SQL"));
  
exports.getDatabase = () => {
     return database;
 }