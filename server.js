const app       = require('./app');
const server    = require('http').createServer(app);
const sockets   = require('./SocketIO/rootSocket')(server);
const port      = process.env.PORT || 3000;

// DATABASE
const MONGO_PATH = process.env.MONGODB_URI || 'mongodb://localhost:27017/foursome';
require('./Databases/mongo')(MONGO_PATH);

// require('./Databases/redis').init();


server.listen(port, () => console.log(`Server listening on port ${port}!`));