// On pourra utiliser directement database.query(...)
const database = require("../database/database").getDatabase();


exports.getAllPost = async (req, res)=>{
    try {

    } catch (error) {
        res.status(400).json("Erreur affichage des posts " + error);
    };
};

exports.getOnePost = async (req, res)=>{
    try {

    } catch (error) {
        res.status(400).json("Erreur affichage du post " + error);
    };
};

exports.createPost = async (req, res)=>{
    try {
        if(req.file){
            const newImage = {
                photo_url: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
                user_id: Number(req.body.userId)
            };
            
            const sqlImage = `INSERT INTO photos SET ?`;
            database.query(sqlImage, newImage, (error, result)=>{
                if(error) res.status(400).json(error);
                console.log(result.insertId);
                // res.status(200).json("Image stockée");

                const photoId = result.insertId;
                const newPost = {
                    post_text: req.body.text,
                    photo_id: photoId,
                    user_id: req.body.userId
                };
                const sql = "INSERT INTO posts SET ?";
                database.query(sql, newPost, (error, result)=>{
                if(error) res.status(400).json(error);
                res.status(200).json("Post créé !");
            }); 
        });
        }
    } catch (error) {
        res.status(400).json("Erreur création post " + error);
    };
};

exports.modifyPost = async (req, res)=>{
    try {

    } catch (error) {
        res.status(400).json("Erreur modification post " + error);
    };
};

exports.deletePost = async (req, res)=>{
    try {

    } catch (error) {
        res.status(400).json("Erreur suppression post " + error);
    };
};