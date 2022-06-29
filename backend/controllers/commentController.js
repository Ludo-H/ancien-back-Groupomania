// On pourra utiliser directement database.query(...)
const database = require("../database/database").getDatabase();

exports.getAllComment = async (req, res)=>{
    try {
        // On lance la requete
        const sql = "SELECT * FROM comments";
        database.query(sql, (error, result)=>{
            if(error) throw error;
            // Affichage des infos des comm, a voir si on sélectionne les resultats...
            res.status(200).json(result);
        });
    } catch (error) {
        res.status(400).json("Erreur affichage des comments " + error);
    };
};

exports.getOneComment = async (req, res)=>{
    try {
        // On isole la requete
        const sql = "SELECT * FROM comments WHERE comment_id = ?";
        // On stocke l'id voulu de la requete
        const commentId = req.params.id;
        database.query(sql, commentId, (error, result)=>{
            if(error) throw error;
            res.status(200).json(result);
        });
    } catch (error) {
        res.status(400).json("Erreur affichage du comment " + error);
    };
};

exports.createComment = async (req, res)=>{
    try {
        // Création du contenu à envoyer
        const newComment = {
            comment_text: req.body.text,
            user_id: req.body.userId,
            post_id: req.body.postId
        };
        // Envoie dans la BDD
        const sql = "INSERT INTO comments SET ?";
        database.query(sql, newComment, (error, result)=>{
        if(error) res.status(400).json(error);
        res.status(200).json("Commentaire créé !");
    }); 
    } catch (error) {
        res.status(400).json("Erreur création comment " + error);
    };
};

exports.modifyComment = async (req, res)=>{
    try {

    } catch (error) {
        res.status(400).json("Erreur modification comment " + error);
    };
};

exports.deleteComment = async (req, res)=>{
    try {
        const sql = "DELETE FROM comments WHERE comment_id = ?";
        const commentId = req.params.id;
        database.query(sql, commentId, (error, result)=>{
            if(!result) throw error;
            res.status(200).json("Comment supprimé");
        });
    } catch (error) {
        res.status(400).json("Erreur suppression comment " + error);
    };
};