// On pourra utiliser directement database.query(...)
const database = require("../database/database").getDatabase();

// Importation du module fs de node, pour accéder aux fichiers du serveur (supprimer une image de images)
const fs = require("fs");

//********************************************************************/
exports.getAllPost = async (req, res) => {
    try {
        // On lance la requete
        const sql = "SELECT * FROM posts ORDER BY post_createdat DESC";
        database.query(sql, (error, result) => {
            if (error) throw error;
            // Affichage des infos du post, a voir si on sélectionne les resultats...
            res.status(200).json(result);
        });
    } catch (error) {
        res.status(400).json("Erreur affichage des posts " + error);
    };
};
//********************************************************************/


//********************************************************************/
exports.getOnePost = async (req, res) => {
    try {
        // On isole la requete
        const sql = "SELECT * FROM posts WHERE post_id = ?";
        // On stocke l'id voulu de la requete
        const postId = req.params.id;
        database.query(sql, postId, (error, result) => {
            if (error) throw error;
            res.status(200).json(result);
        });
    } catch (error) {
        res.status(400).json("Erreur affichage du post " + error);
    };
};
//********************************************************************/


//********************************************************************/
exports.createPost = async (req, res) => {
    try {
        // Si le post contient un fichier
        if (req.file) {
            // On créé le contenu à envoyer
            const newImage = {
                photo_url: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
                user_id: req.auth.userId
            };
            // Requete a part
            // On envoie d'abord la photo dans la BDD, puis le post
            const sqlImage = `INSERT INTO photos SET ?`;
            database.query(sqlImage, newImage, (error, result) => {
                if (error) res.status(400).json(error);

                // result.insertId reprend l'id créé de la photo plus haut, il nous permet de faire le lien entre les deux tables
                const photoId = result.insertId;
                // On créé le contenu à envoyer
                const newPost = {
                    post_text: req.body.text,
                    photo_id: photoId,
                    user_id: req.auth.userId
                };
                // Envoie du post dans la BDD
                const sql = "INSERT INTO posts SET ?";
                database.query(sql, newPost, (error, result) => {
                    if (error) res.status(400).json(error);
                    res.status(200).json("Post créé !");
                });
            });
        };

        // Si le post ne contient pas de fichier
        if (!req.file) {
            // Création du contenu à envoyer
            const newPost = {
                post_text: req.body.text,
                user_id: req.auth.userId
            };
            // Envoie dans la BDD
            const sql = "INSERT INTO posts SET ?";
            database.query(sql, newPost, (error, result) => {
                if (error) res.status(400).json(error);
                res.status(200).json("Post créé !");
            });
        };
    } catch (error) {
        res.status(400).json("Erreur création post " + error);
    };
};
//********************************************************************/


//********************************************************************/
exports.modifyPost = async (req, res) => {
    try {
        const sqlAdmin = `SELECT * FROM posts WHERE post_id = ${req.params.id}`;
        database.query(sqlAdmin, (error, result) => {
            if (error) res.status(400).json("Erreur affichage post à supprimer " + error);
            const userOfPost = result[0].user_id;

            if (userOfPost == req.auth.userId || req.auth.admin == 1) {
                // Modification si il y a une image dans le nouveau post
                if (req.file) {
                    // daboord on supprime l'image existante du fichier 
                    // puis on met a jour le contenu
                    // On affiche d'abord le post en question
                    let sql = `SELECT * FROM posts WHERE post_id = ?`;
                    database.query(sql, req.params.id, (error, result) => {
                        if (error) res.status(400).json("Erreur affichage post avec image " + error);

                        // La ligne permet de vérifier si l'ancien post contient une image
                        // On supprime ici l'image du dossier    
                        if (result[0].photo_id > 0) {

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
                                    user_id: req.auth.userId
                                };

                                // Requete pour remplacer l'ancienne image par la nouvelle dans la BDD, sans recréer d'id
                                const sqlImage = `UPDATE photos SET ? WHERE photo_id = ${result[0].photo_id}`;
                                database.query(sqlImage, newImage, (error, result) => {
                                    if (error) res.status(400).json(error);

                                    // On créé le contenu à envoyer
                                    const updatePost = {
                                        post_text: req.body.text,
                                        photo_id: photoId, // Variable IMPORTANTE plus haut, sans ça le contenu n'est pas retrouvable
                                        user_id: req.auth.userId,
                                        post_createdat: new Date()
                                    };
                                    // On update le post dans la BDD
                                    const sql = `UPDATE posts SET ? WHERE post_id = ${req.params.id}`;
                                    database.query(sql, updatePost, (error, result) => {
                                        if (error) res.status(400).json(error);
                                        res.status(200).json("Post mis à jour !");
                                    });
                                });
                            });
                        }

                        // Si l'ancien post ne contient pas d'image
                        else {
                            // On créé le contenu à envoyer
                            const newImage = {
                                photo_url: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
                                user_id: req.auth.userId
                            };
                            // On envoie d'abord la photo dans la BDD, puis le post
                            const sqlImage = `INSERT INTO photos SET ?`;
                            database.query(sqlImage, newImage, (error, result) => {
                                if (error) res.status(400).json(error);

                                // result.insertId reprend l'id créé de la photo plus haut, il nous permet de faire le lien entre les deux tables
                                const photoId = result.insertId;
                                // On créé le contenu à envoyer
                                const updatePost = {
                                    post_text: req.body.text,
                                    photo_id: photoId,
                                    user_id: req.auth.userId,
                                    post_createdat: new Date()
                                };
                                // Envoie du post dans la BDD
                                const sql = `UPDATE posts SET ? WHERE post_id = ${req.params.id}`;
                                database.query(sql, updatePost, (error, result) => {
                                    if (error) res.status(400).json(error);
                                    res.status(200).json("Post mis à jour !");
                                });
                            });
                        };
                    });
                };


                // Modification si il n'y a pas d'image dans le nouveau post
                if (!req.file) {
                    // const sqlPost = `SELECT * FROM posts WHERE post_id = ${req.params.id}`;
                    // database.query(sql, (error, result)=>{
                    //     if (error) res.status(400).json("Erreur affichage post " + error);
                    //     if(result[0].photo_id > 0){

                    //     }else{
                            
                    //     }
                    // });
                    // Inutile de modifier un post avec image pour lui apporter des modifications sans image, et en voulant supprimer l'image.
                    // Autant supprimer le post et en recréer un autre

                    // Contenu du nouveau post, le post id ne doit pas apparaitre dans le contenu
                    const updatePost = {
                        post_text: req.body.text,
                        user_id: req.auth.userId,
                        post_createdat: new Date() // Important car la date resterait l'ancienne
                    };
                    // La requete en selectionnant le post_id
                    const sql = `UPDATE posts SET ? WHERE post_id = ${req.params.id}`;
                    database.query(sql, updatePost, (error, result) => {
                        if (error) res.status(400).json("Erreur update du post sans image" + error);
                        res.status(200).json("Post sans image modifié");
                    });
                };
            } else {
                res.status(400).json("Action non autorisée");  
            }
        })

    } catch (error) {
        res.status(400).json("Erreur modification post " + error);
    };
};
//********************************************************************/


//********************************************************************/
exports.deletePost = async (req, res) => {
    try {
        const sqlAdmin = `SELECT * FROM posts WHERE post_id = ${req.params.id}`;
        database.query(sqlAdmin, (error, result) => {
            if (error) res.status(400).json("Erreur affichage post à supprimer " + error);
            const userOfPost = result[0].user_id;

            if (userOfPost == req.auth.userId || req.auth.admin == 1) {
                if (result[0].photo_id != null) {
                    // Cette variable IMPORTANTE va nous servir plus bas pour crééer le nouveau contenu
                    const photoId = result[0].photo_id

                    // On affiche la photo grace à l'id récupéré dans le post plus haut
                    const sql = `SELECT * FROM photos WHERE photo_id = ${photoId}`;
                    database.query(sql, (error, result) => {
                        if (error) res.status(400).json("Erreur affichage de la photo dans la table " + error);

                        // On recréé le nom de l'image sans le chemin avant
                        const imageToDelete = result[0].photo_url.split('/images')[1];

                        // On supprime l'image du dossier node
                        fs.unlink(`images/${imageToDelete}`, () => {
                            if (error) console.log("Erreur de suppression image dans le dossier " + error);
                            console.log('Image supprimée du dossier');
                        });

                        const sqlImage = 'DELETE FROM photos WHERE photo_id = ?';
                        database.query(sqlImage, photoId, (error, result) => {
                            if (error) res.status(400).json("Erreur supression image, supression post " + error);
                            console.log("Image supprimé BDD");
                        });


                        const sql = "DELETE FROM posts WHERE post_id = ?";
                        const postId = req.params.id;
                        database.query(sql, postId, (error, result) => {
                            if (!result) throw error;
                            res.status(200).json("Post supprimé");
                        });

                    })
                } else {
                    const sql = "DELETE FROM posts WHERE post_id = ?";
                    const postId = req.params.id;
                    database.query(sql, postId, (error, result) => {
                        if (!result) throw error;
                        res.status(200).json("Post supprimé");
                    });
                }
            } else {
                res.status(400).json("Action non autorisée");
            }
        })
    } catch (error) {
        res.status(400).json("Erreur suppression post " + error);
    };
};
//********************************************************************/