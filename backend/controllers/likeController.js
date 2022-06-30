// On pourra utiliser directement database.query(...)
const database = require("../database/database").getDatabase();

exports.likePost = async (req, res)=>{
    try {
        // On créé le like
        const infosLike = {
            user_id: req.body.userId,
            post_id: req.body.postId
        };
        // On veut d'abord afficher le like pour voir si il existe
        const sql = `SELECT * FROM likes WHERE user_id = ${infosLike.user_id} AND post_id = ${infosLike.post_id}`;
        database.query(sql, (error, result)=>{
            if(error) res.status(400).json("Erreur de requete affichage like " + error);
            // Si le contenu est vide (pas de like)
            if(result.length === 0){
                // Alors on insère un like correspondant à l'user qui a cliqué sur le post en question
                const sqlAddLike = `INSERT INTO likes (user_id, post_id) VALUES (${infosLike.user_id}, ${infosLike.post_id})`;
                database.query(sqlAddLike, (error, result)=>{
                    if(error) res.status(400).json("Erreur ajout du like " + error);
                    res.status(200).json("Like ajouté !")
                });
            // Si result renvoi du contenu (le like est dejà présent)
            }else{
                // Alors on le supprime (en recliquant dessus)
                const sqlRemoveLike = `DELETE FROM likes WHERE user_id = ${infosLike.user_id} AND post_id = ${infosLike.post_id}`;
                database.query(sqlRemoveLike, (error, result)=>{
                    if(error) res.status(400).json("Erreur remove like " + error);
                    res.status(200).json("Like supprimé")
                });
            };
        });
    } catch (error) {
        res.status(400).json("Erreur like du post " + error);
    };
};

exports.totalLikes = async (req, res)=>{
    try {
        // On veut afficher tous les like d'un post
        const sql = `SELECT * FROM likes WHERE post_id = ${req.params.id}`;
        database.query(sql, (error, result)=>{
            if(error) res.status(400).json("Erreur affichage des likes du post " + error);
            res.status(400).json(result);
        });
    } catch (error) {
        res.status(400).json("Erreur création user dans totalLikes " + error);
    };
};