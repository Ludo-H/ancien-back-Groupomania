// Importation bcrypt
const bcrypt = require("bcrypt");

// Importation de crypto.js pour chiffre le mail
const cryptoJS = require('crypto-js');

// Importation de JWT
const jwt = require("jsonwebtoken");

// Importation de dotenv pour utiliser variable d'environnement
require("dotenv").config();

// On pourra utiliser directement database.query(...)
const database = require("../database/database").getDatabase();



//********************************************************************/
exports.signup = async (req, res) => {
    try {
        // On crypte le mail
        const emailCryptoJS = cryptoJS.HmacSHA256(req.body.email, process.env.CHIFFREMENT_EMAIL).toString();
        // On crypte le MDP
        const passwordCrypt = await bcrypt.hash(req.body.password, 10);
        // On créé un nouvel user
        const newUser = {
            user_email : emailCryptoJS,
            user_password : passwordCrypt,
            user_firstname : req.body.firstname,
            user_lastname : req.body.lastname
        };
        // On créé la requete
        const sql = "INSERT INTO users SET ?";
        database.query(sql, newUser, (error, result)=>{
            if(error) throw error;
            res.status(200).json("Utilisateur créé !");
        });
        
    } catch (error) {
        res.status(400).json("Erreur création compte " + error);
    };
};
//********************************************************************/


//********************************************************************/
exports.login = (req, res) => {
    try {
        // On crypte le mail
        const emailCryptoJS = cryptoJS.HmacSHA256(req.body.email, process.env.CHIFFREMENT_EMAIL).toString();
        // On créé la requète
        const sql = "SELECT * FROM users WHERE user_email = ?";
        database.query(sql, emailCryptoJS, async (error, result)=>{
            // Si l'index 0 de result est faux
            if(!result[0]){
                res.status(400).json('Email incorrect'); 
            // Sinon
            }else {
                // On compare le MDP entré et celui dans la BDD correspondant
                const passwordControl = await bcrypt.compare(req.body.password, result[0].user_password);
                // Si le passwordControl est faux
                if(!passwordControl) { 
                    res.status(400).json("Mot de passe incorrect");
                // Sinon
                }else{
                    // On créé la const token pour pouvoir l'utiliser
                    const token = jwt.sign(
                        {userId: result[0].user_id},
                        process.env.JWT_KEY,
                        {expiresIn: "24h"}
                        );
                    // On stocke le token dans les cookies
                    res.cookie("jwt", token);
                    // On envoie en réponse à la connexion des infos sur l'user et son token
                    res.status(200).json({
                        user: result[0],
                        token
                    });
                };
            };
        });
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
exports.deleteAccount = async (req, res) => {
    try {
        const sql = "DELETE FROM users WHERE user_id = ?";
        const userId = req.params.id;
        database.query(sql, userId, (error, result)=>{
            if(!result) throw error;
            res.status(200).json("Compte supprimé");
        });
    } catch (error) {
        res.status(400).json("Erreur suppression compte " + error);
    };
};
//********************************************************************/


//********************************************************************/
exports.logout = async (req, res) => {
    try {
        // Sans le token la connexion n'est plus possible
        res.clearCookie("jwt");
        res.status(200).json("Utilisateur déconnecté");
    } catch (error) {
        res.status(400).json("Erreur déconnexion compte " + error);
    };
};
//********************************************************************/


//********************************************************************/
exports.getOneUser = async (req, res) => {
    try {
        // On isole la requete
        const sql = "SELECT * FROM users WHERE user_id = ?";
        // On stocke l'id voulu de la requete
        const userId = req.params.id;
        database.query(sql, userId, (error, result)=>{
            if(error) throw error;
            // On sélectionne les infos de l'user que l'on souhaite retourner
            const userInfos = {
                firstname: result[0].user_firstname,
                lastname: result[0].user_lastname,
                photo: result[0].user_profileurl
            };
            res.status(200).json(userInfos);
        });

    } catch (error) {
        res.status(400).json("Erreur affichage utilisateur " + error);
    };
};
//********************************************************************/