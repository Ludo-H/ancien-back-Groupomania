const express = require("express");
const likeController = require("../controllers/likeController")

// On importe le middleware d'authentification
const authentification = require('../middleware/authentification');

// On utilise router de express
const router = express.Router();

// Les routes
router.post("/", authentification, likeController.likePost);
router.post("/liked", authentification, likeController.postLiked);


module.exports = router;