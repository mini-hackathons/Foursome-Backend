require('dotenv').config();
const express       = require('express');
const app           = express();

const helmet        = require('helmet');
const cors          = require('cors');
const morgan        = require('morgan');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const passport      = require('passport')
const session       = require('express-session');
const mongoose      = require('mongoose');
const MongoStore    = require('connect-mongo')(session);
const flash         = require('connect-flash');


// MIDDLEWARE
app.use(helmet());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3001',
}));
app.use(morgan('dev'));                 // log every request to the console
app.use(cookieParser());                // read cookies (needed for auth)
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());             // get information from html forms

// DATABASE
const db = mongoose.connection;

// AUTHENTICATION
app.use(session({
    secret: '123',                      // session secret
    // name: 'closet-cookie',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: db })
}));
require('./config/passport')(passport); // pass passport for configuration
app.use(passport.initialize());
app.use(passport.session());            // persistent login sessions
app.use(flash());                       // use connect-flash for flash messages stored in session

// ROUTER
const router = express.Router();
app.use(router);
const routes = require('./routes/index');
routes(router);

module.exports = app;