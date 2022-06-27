// On installe multer
const multer = require("multer");


// La collection des MIME TYPE
const MIME_TYPES = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/gif' : 'gif',
    'image/png' : 'png'
};


// Quand le FE envoie une image, il faut savoir ou la placer
// On met une destination et on génère un nom de fichier unique
const storage = multer.diskStorage({  // Syntaxe dans doc multer
    destination : (req, file, callback)=>{
        // Nul reprend l'argument erreur qui n'est pas défini, il n'y a pas d'erreur
        callback(null, "images");
    },
    filename : (req, file, callback)=>{
        // On supprime les espaces dans le nom du fichier et on les joints avec des _
        const name = file.originalname.split(" ").join('_');


        // MIME TYPE indique la nature et le format d'un document
        const extension = MIME_TYPES[file.mimetype];


        callback(null,  name + '_' + Date.now() + "." + extension)
    }
})


// On exporte seulement une image de storage
module.exports = multer({storage}).single("image");