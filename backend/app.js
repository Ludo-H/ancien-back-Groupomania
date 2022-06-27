// Importer express
const express = require("express");


// On installe et ajout helmet pour sécuriser "en configurant de manière appropriée des en-têtes HTTP."
const helmet = require('helmet');


// Permet de créer une application express
const app = express();


// On importe la BDD
const database = require("./database/database");


// On importe dotenv pour l'utiliser dans l'adresse de la BDD
require('dotenv').config();


// On importe les routes
const userRoutes = require("./routes/user");
const commentRoutes = require("./routes/comment");
const postRoutes = require("./routes/post");
const likeRoutes = require("./routes/like");


// Importation node de path (deja dans node) pour travailler avec les chemins de fichiers et de répertoires
const path = require("path");


// On veut transformer le corps (body) de la requete en json
// On transforme le body en json
app.use(express.json());


// On gère le CORS (on peut avoir des bug si le FE est sur un server et le BE sur un autre)
// Avec ce code on accepte toutes les requetes de différents server sur notre API
app.use((req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*"); // Les requetes d'autres server peuvent venir
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


// On créé la route d'authentification
app.use("/api/user", userRoutes);


// On créé la route pour les sauces
app.use("/api/comment", commentRoutes);


// On créé la route pour les sauces
app.use("/api/post", postRoutes);


// On créé la route pour les sauces
app.use("/api/like", likeRoutes);


// On créé la route pour accéder aux images postées
app.use("/images", express.static(path.join(__dirname, "images")));


// Utiliser helmet à la fin, problemes d'affichage d'images rencontrés si fonction plus haut
app.use(helmet());


// On exporte cette app pour pouvoir y accéder de partout
module.exports = app;