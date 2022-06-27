// Vérifier le MDP écrit au signup
const passwordValidator = require("password-validator");


// Création du schema pour un MDP valide
const passwordSchema = new passwordValidator();


passwordSchema
.is().min(8)
.is().max(100)
.has().uppercase(1)
.has().lowercase()
.has().digits(1)
.has().not().spaces()
.is().not().oneOf(['Passw0rd', 'Password123', 'Azerty1', 'Qwerty1', 'Qwerty0', 'Azerty0'])


// On vérifie le password par rapport au schema
// Si le MDP répond aux schema fisé alors on passe à l'étape suivante (controller/user)
// Sinon on affiche une erreur avec la liste de ce qui ne va pas
module.exports = (req, res, next) => {
    if(passwordSchema.validate(req.body.password)){
        next();
    }else{
        return res
        .status(400)
        .json({error: `Mot de passe invalide ${passwordSchema.validate(req.body.password, {list: true})}`})
    }
}