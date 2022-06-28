// On pourra utiliser directement database.query(...)
const database = require("../database/database").getDatabase();

//********************************************************************/
exports.getAllPost = async (req, res)=>{
    try {
        // On lance la requete
        const sql = "SELECT * FROM posts";
        database.query(sql, (error, result)=>{
            if(error) throw error;
            // Affichage des infos du post, a voir si on sélectionne les resultats...
            res.status(200).json(result);
        });
    } catch (error) {
        res.status(400).json("Erreur affichage des posts " + error);
    };
};
//********************************************************************/


//********************************************************************/
exports.getOnePost = async (req, res)=>{
    try {
        // On isole la requete
        const sql = "SELECT * FROM posts WHERE post_id = ?";
        // On stocke l'id voulu de la requete
        const postId = req.params.id;
        database.query(sql, postId, (error, result)=>{
            if(error) throw error;
            res.status(200).json(result);
        });
    } catch (error) {
        res.status(400).json("Erreur affichage du post " + error);
    };
};
//********************************************************************/


//********************************************************************/
exports.createPost = async (req, res)=>{
    try {
        // Si le post contient un fichier
        if(req.file){
            // On créé le contenu à envoyer
            const newImage = {
                photo_url: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
                user_id: Number(req.body.userId)
            };
            // Requete a part
            // On envoie d'abord la photo dans la BDD, puis le post
            const sqlImage = `INSERT INTO photos SET ?`;
            database.query(sqlImage, newImage, (error, result)=>{
                if(error) res.status(400).json(error);

                // result.insertId reprend l'id créé de la photo plus haut, il nous permet de faire le lien entre les deux tables
                const photoId = result.insertId;
                // On créé le contenu à envoyer
                const newPost = {
                    post_text: req.body.text,
                    photo_id: photoId,
                    user_id: req.body.userId
                };
                // Envoie du post dans la BDD
                const sql = "INSERT INTO posts SET ?";
                database.query(sql, newPost, (error, result)=>{
                if(error) res.status(400).json(error);
                res.status(200).json("Post créé !");
            }); 
        });
        };

        // Si le post ne contient pas de fichier
        if(!req.file){
            // Création du contenu à envoyer
            const newPost = {
                post_text: req.body.text,
                user_id: req.body.userId
            };
            // Envoie dans la BDD
            const sql = "INSERT INTO posts SET ?";
            database.query(sql, newPost, (error, result)=>{
            if(error) res.status(400).json(error);
            res.status(200).json("Post créé !");
        }); 
        };
    } catch (error) {
        res.status(400).json("Erreur création post " + error);
    };
};
//********************************************************************/


//********************************************************************/
exports.modifyPost = async (req, res)=>{
    try {

    } catch (error) {
        res.status(400).json("Erreur modification post " + error);
    };
};
//********************************************************************/


//********************************************************************/
exports.deletePost = async (req, res)=>{
    try {
        const sql = "DELETE FROM posts WHERE post_id = ?";
        const postId = req.params.id;
        database.query(sql, postId, (error, result)=>{
            if(!result) throw error;
            res.status(200).json("Post supprimé");
        });
    } catch (error) {
        res.status(400).json("Erreur suppression post " + error);
    };
};
//********************************************************************/