// Importer le package HTTP (déjà installé sur Node) pour avoir les outils pour créer le server
const http = require("http");


// Importer l'application
const app = require('./app');


// Importer dotenv pour utiliser les variables d'environnement, les fonctions permettent de lier les deux docs
require("dotenv").config();


//************************************************************************************************ */
const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
};


const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
  
const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
};
//********************************************************************************* */


// création du server avec la méthode createServer() qui prend un argument
// La fonction sera appelée à chaque requète reçu par le server
// Les fonctions des requètes reçu sont dans app.js
const server = http.createServer(app);


//*************************************************************************** */
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});
//*************************************************************************** */


// Le server est à l'écoute des requètes de ce port
server.listen(port);
