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
            user_email: emailCryptoJS,
            user_password: passwordCrypt,
            user_firstname: req.body.firstname,
            user_lastname: req.body.lastname
        };
        // On créé la requete 
        const sql = "INSERT INTO users SET ?";
        database.query(sql, newUser, (error, result) => {
            if (error) throw error;
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
        database.query(sql, emailCryptoJS, async (error, result) => {
            // Si l'index 0 de result est faux
            if (!result[0]) {
                res.status(400).json('Email incorrect');
                // Sinon
            } else {
                // On compare le MDP entré et celui dans la BDD correspondant
                const passwordControl = await bcrypt.compare(req.body.password, result[0].user_password);
                // Si le passwordControl est faux
                if (!passwordControl) {
                    res.status(400).json("Mot de passe incorrect");
                    // Sinon
                } else {
                    // On créé la const token pour pouvoir l'utiliser
                    const token = jwt.sign(
                        { userId: result[0].user_id, admin: result[0].user_isadmin},
                        process.env.JWT_KEY,
                        { expiresIn: "24h" }
                    );
                    // On stocke le token dans les cookies
                    res.cookie("jwt", token);
                    // On envoie en réponse à la connexion des infos sur l'user et son token
                    res.status(200).json({
                        userId: result[0].user_id,
                        admin: result[0].user_isadmin,
                        token: token
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
        // On va vérifier si l'utilisateur est l'admin ou si il agit bien sur son compte
        const sqlAdmin = `SELECT * FROM users WHERE user_id = ${req.auth.userId}`;
        database.query(sqlAdmin, (error, result) => {
            if (error) res.status(400).json("Erreur affichage delete user " + error);
            // Pour pouvoir modifier, soit admin soit bon user
            if (req.auth.userId == req.params.id || req.auth.admin == 1) {
                // Modification si il y a une image dans les changements user
                if (req.file) {
                    // const newPhoto = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
                    // const updateInfos = {
                    //     user_firstname: req.body.firstname,
                    //     user_lastname: req.body.lastname,
                    //     user_profilUrl: newPhoto
                    // };
                    // const sql = `UPDATE users SET ? WHERE user_id = ${req.params.id}`;
                    // database.query(sql, updateInfos, (error, result)=>{
                    //     if(error) res.status(400).json("Erreur changements user avec photo " + error);
                    //     res.status(200).json("Utilisateur à jour");
                    // });
                    let sql = `SELECT * FROM users WHERE user_id = ?`;
                    database.query(sql, req.params.id, (error, result) => {
                        if (error) res.status(400).json("Erreur affichage user avec image " + error);

                        // La ligne permet de vérifier si l'ancien post contient une image
                        // On supprime ici l'image du dossier    
                        if (result[0].photo_id != 51) {

                            // Cette variable IMPORTANTE va nous servir plus bas pour crééer le nouveau contenu
                            const photoId = result[0].photo_id

                            // On affiche la photo grace à l'id récupéré dans le post plus haut
                            const sql = `SELECT * FROM photos WHERE photo_id = ${result[0].photo_id}`;
                            database.query(sql, (error, result) => {
                                if (error) res.status(400).json("Erreur affichage de la photo dans la table " + error);

                                // On recréé le nom de l'image sans le chemin avant
                                const imageToDelete = result[0].photo_url.split('/images')[1];

                                // On supprime l'image du dossier node
                                fs.unlink(`images/${imageToDelete}`, () => {
                                    if (error) console.log("Erreur de suppression image dans le dossier " + error);
                                    console.log('Image supprimée du dossier');
                                })

                                // On créé le contenu pour insérer la nouvelle image
                                const newImage = {
                                    photo_url: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
                                    user_id: req.params.id
                                };

                                // Requete pour remplacer l'ancienne image par la nouvelle dans la BDD, sans recréer d'id
                                const sqlImage = `UPDATE photos SET ? WHERE photo_id = ${result[0].photo_id}`;
                                database.query(sqlImage, newImage, (error, result) => {
                                    if (error) res.status(400).json(error);

                                    // On créé le contenu à envoyer
                                    const updateUser = {
                                        photo_id: photoId, // Variable IMPORTANTE plus haut, sans ça le contenu n'est pas retrouvable
                                        user_firstname: req.body.firstname,
                                        user_lastname: req.body.lastname,
                                    };
                                    // On update le post dans la BDD
                                    const sql = `UPDATE users SET ? WHERE user_id = ${req.params.id}`;
                                    database.query(sql, updateUser, (error, result) => {
                                        if (error) res.status(400).json(error);
                                        res.status(200).json("User mis à jour !");
                                    });
                                });
                            })
                        }



                        else if (result[0].photo_id == 51) {
                            // On créé le contenu à envoyer
                            const newImage = {
                                photo_url: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
                                user_id: req.params.id
                            };
                            // On envoie d'abord la photo dans la BDD, puis le post
                            const sqlImage = `INSERT INTO photos SET ?`;
                            database.query(sqlImage, newImage, (error, result) => {
                                if (error) res.status(400).json(error);

                                // result.insertId reprend l'id créé de la photo plus haut, il nous permet de faire le lien entre les deux tables
                                const photoId = result.insertId;
                                // On créé le contenu à envoyer
                                const updateUser = {
                                    photo_id: photoId, // Variable IMPORTANTE plus haut, sans ça le contenu n'est pas retrouvable
                                    user_firstname: req.body.firstname,
                                    user_lastname: req.body.lastname,
                                };
                                // Envoie du post dans la BDD
                                const sql = `UPDATE users SET ? WHERE user_id = ${req.params.id}`;
                                database.query(sql, updateUser, (error, result) => {
                                    if (error) res.status(400).json(error);
                                    res.status(200).json("User mis à jour !");
                                });
                            });


                        };
                    })
                }


                // Modification si il n'y a pas d'image dans les changements user
                if (!req.file) {
                    const updateInfos = {
                        user_firstname: req.body.firstname,
                        user_lastname: req.body.lastname
                    };
                    const sql = `UPDATE users SET ? WHERE user_id = ${req.params.id}`;
                    database.query(sql, updateInfos, (error, result) => {
                        if (error) res.status(400).json("Erreur de changement infos user " + error);
                        res.status(200).json("Modifications user à jour");
                    });
                };
            } else {
                res.status(400).json("Action non autorisée");
            }
        });

    } catch (error) {
        res.status(400).json("Erreur modification utilisateur " + error);
    };
};
//********************************************************************/


//********************************************************************/
exports.deleteAccount = async (req, res) => {
    try {
         // On va vérifier si l'utilisateur est l'admin ou si il agit bien sur son compte
        const sqlAdmin = `SELECT * FROM users WHERE user_id = ${req.auth.userId}`;
        database.query(sqlAdmin, (error, result) => {
            if (error) res.status(400).json("Erreur affichage delete user " + error);
            // Pour pouvoir modifier, soit admin soit bon user
            if (req.auth.userId == req.params.id || req.auth.admin == 1) {
                console.log("Auth vérifiée");
                const sql = "DELETE FROM users WHERE user_id = ?";
                const userId = req.params.id;
                database.query(sql, userId, (error, result) => {
                    if (!result) throw error;
                    res.status(200).json("Compte supprimé");
                });
            } else {
                res.status(400).json("Action non autorisée");
            }
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
        database.query(sql, userId, (error, result) => {
            if (error) throw error;
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