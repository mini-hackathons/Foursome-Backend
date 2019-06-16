const app       = require('./app');
const server    = require('http').createServer(app);
const io        = require('socket.io')(server);
const port      = process.env.PORT || 3000;

// DATABASE
const MONGO_PATH = process.env.MONGODB_URI || 'mongodb://localhost:27017/foursome';
require('./database')(MONGO_PATH);

server.listen(port, () => console.log(`Server listening on port ${port}!`));