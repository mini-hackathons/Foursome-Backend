const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : 'localhost',
    port     : '3306',
    user     : 'root',
    password : 'password',
    database : 'closet'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected to MySQL!');
});

// const sql = 'CREATE DATABASE closet';
// connection.query(sql, (err, result) => {
//     if(err) throw err;
//     console.log(result);
// });

module.exports = connection;