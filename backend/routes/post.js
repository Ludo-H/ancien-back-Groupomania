const express = require("express");
const postController = require("../controllers/postController")

// On importe le middleware d'authentification
const authentification = require('../middleware/authentification');

// Importation de multer pour gérer les images
const multer = require("../middleware/multer");

// On utilise router de express
const router = express.Router();

// Les routes
// Route pour afficher tous les post : GET /api/post
router.get("/", authentification, postController.getAllPost);

// Route pour afficher le post cliqué : GET /api/post/:id
router.get("/:id", authentification, postController.getOnePost)

// Route pour créer un post dans la BDD : POST /api/post 
router.post("/", authentification, multer, postController.createPost);

// Route pour modifier le post créé : PUT /api/post/:id
router.put("/:id", authentification, multer, postController.modifyPost)

// Route pour supprimer un post créé : DELETE /api/post/:id
router.delete("/:id", authentification, postController.deletePost)





// Route pour ajouter un likie/dislike : POST /api/sauces/:id/like
// router.post("/:id/like", authentification, sauceController.likeSauce)


// Exporter le module
module.exports = router;