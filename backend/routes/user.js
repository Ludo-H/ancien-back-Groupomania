// Importer Express pour utiliser la fonction router
const express = require("express");

// Importation de multer pour gérer les images
const multer = require("../middleware/multer");

// On importe le middleware d'authentification
const authentification = require('../middleware/authentification');


// Importation middleware password
const password = require("../middleware/password");


// Importation du middleware emailValidator
const emailValidator = require("../middleware/emailValidator");


// On importe du controller user
const userController = require("../controllers/userController")


// On utilise router de express
const router = express.Router();


// La route de signup
// On rajoute password qui va vérifier si le MDP est fort (voir middleware/password) et diriger ou non vers le controller qui créé un user dans la BDD
router.post("/signup", emailValidator, password, userController.signup);

// La route login
router.post("/login", userController.login);

// La route update
router.put("/:id", authentification, multer, userController.updateUser);

// La route désactiver compte
router.delete("/delete/:id", authentification, userController.deleteAccount);

// La route se déconnecter
router.get("/logout", userController.logout)

// La route get user
router.get("/:id", authentification, userController.getOneUser);


// Exporter le module
module.exports = router;