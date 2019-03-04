const express = require('express');
const app = express();
const helmet = require('helmet');
const bodyParser = require('body-parser');

// MIDDLEWARE
app.use(helmet());
app.use(bodyParser.json());

// ROUTER
const router = express.Router();
app.use(router);
const routes = require('./routes/index');
routes(router);


// CREATE DATABASE hacktech
// DROP DATABASE hacktech
// CREATE TABLE user (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(20) NOT NULL, password VARCHAR(20) NOT NULL)
// CREATE TABLE calendar_year (id INT AUTO_INCREMENT PRIMARY KEY, value INT not null, user_id INT NOT NULL, foreign key (user_id) references user(id))
// CREATE TABLE calendar_month (id INT AUTO_INCREMENT PRIMARY KEY, value INT not null, year_id INT NOT NULL, foreign key (year_id) references calendar_year(id))
// CREATE TABLE calendar_week (id INT AUTO_INCREMENT PRIMARY KEY, value INT not null, month_id INT NOT NULL, foreign key (month_id) references calendar_month(id))
// CREATE TABLE calendar_day (id INT AUTO_INCREMENT PRIMARY KEY, value INT not null, week_id INT NOT NULL, foreign key (week_id) references calendar_week(id))
// CREATE TABLE friend_pairs (id INT AUTO_INCREMENT PRIMARY KEY, friend1 INT not null, friend2 INT NOT NULL, foreign key (friend1) references user(id), foreign key (friend2) references user(id))

// ALTER TABLE customers ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY


const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Server listening on port ${port}!`));