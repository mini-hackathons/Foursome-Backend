const app       = require('./app');
const port      = process.env.PORT || 3000;

// DATABASE
const MONGO_PATH = process.env.MONGODB_URI || 'mongodb://localhost:27017/closet';
require('./database')(MONGO_PATH);

app.listen(port, () => console.log(`Server listening on port ${port}!`));