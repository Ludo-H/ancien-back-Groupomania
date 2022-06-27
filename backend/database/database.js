const mysql = require("mysql")

// Création de la connexion avec la BDD
const database = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Ludo',
    database : "groupomania"
  });
  
exports.getDatabase = () => {
     return database;
 }