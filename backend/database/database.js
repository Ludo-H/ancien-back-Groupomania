const mysql = require("mysql")

require('dotenv').config();

// Création de la connexion avec la BDD
const database = mysql.createConnection({
    host     : process.env.HOST,
    user     : process.env.USER,
    database : process.env.DATABASE
  },
  console.log("Connecté à la BDD SQL"));
  
exports.getDatabase = () => {
     return database;
 }