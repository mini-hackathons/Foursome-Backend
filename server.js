const app       = require('./app');
const server    = require('http').createServer(app);
const sockets   = require('./SocketIO/rootSocket')(server);
const port      = process.env.PORT || 3000;

// DATABASE
require('./Databases/mongo')();

// require('./Databases/redis').init();


server.listen(port, () => console.log(`Server listening on port ${port}!`));