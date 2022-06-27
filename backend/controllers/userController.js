// Importation bcrypt
const bcrypt = require("bcrypt");

// Importation de crypto.js pour chiffre le mail
const cryptoJS = require('crypto-js');

// Importation de JWT
const jwt = require("jsonwebtoken");

// Importation de dotenv pour utiliser variable d'environnement
require("dotenv").config();

const database = require("../database/database");



//********************************************************************/
exports.signup = async (req, res) => {
    try {

    } catch (error) {
        res.status(400).json("Erreur création compte " + error);
    };
};
//********************************************************************/


//********************************************************************/
exports.login = async (req, res) => {
    try {

    } catch (error) {
        res.status(400).json("Erreur connexion au compte " + error);
    };
};
//********************************************************************/


//********************************************************************/
exports.updateUser = async (req, res) => {
    try {

    } catch (error) {
        res.status(400).json("Erreur modification utilisateur " + error);
    };
};
//********************************************************************/


//********************************************************************/
exports.desactivateAccount = async (req, res) => {
    try {

    } catch (error) {
        res.status(400).json("Erreur désactivation compte " + error);
    };
};
//********************************************************************/


//********************************************************************/
exports.logout = async (req, res) => {
    try {

    } catch (error) {
        res.status(400).json("Erreur déconnexion compte " + error);
    };
};
//********************************************************************/


//********************************************************************/
exports.getOneUser = async (req, res) => {
    try {

    } catch (error) {
        res.status(400).json("Erreur affichage utilisateur " + error);
    };
};
//********************************************************************/