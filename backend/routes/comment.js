const express = require("express");

const commentController = require("../controllers/commentController")

// On importe le middleware d'authentification
const authentification = require('../middleware/authentification');

// Importation de multer pour gérer les images
const multer = require("../middleware/multer");

// On utilise router de express
const router = express.Router();

// Les routes
// Route pour afficher tous les comment : GET /api/comment
router.get("/", authentification, commentController.getAllComment);

// Route pour afficher le comment cliqué : GET /api/comment/:id
router.get("/:id", authentification, commentController.getOneComment);

// Route pour créer un comment dans la BDD : POST /api/comment 
router.post("/", authentification, commentController.createComment);

// Route pour modifier le comment créé : PUT /api/comment/:id
router.put("/:id", authentification, multer, commentController.modifyComment);

// Route pour supprimer un comment créé : DELETE /api/comment/:id
router.delete("/:id", authentification, commentController.deleteComment);



// Exporter le module
module.exports = router;