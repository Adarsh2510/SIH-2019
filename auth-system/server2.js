var express = require('express');
var pg = require("pg");
var app = express();
 
const config = {
    user: 'postgres',
    database: 'auth-system',
    password: 'postgres',
    port: 5432
};

const pool = new pg.Pool(config); 
 
var connectionString = "postgres://postgres:123@localhost:5432/postgres";
 
app.get('/', function (req, res, next) {
    pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       client.query('SELECT * FROM patients where id = $1', [1],function(err,result) {
           done(); // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
    });
});
 
app.listen(4000, function () {
    console.log('Server is running.. on Port 4000');
});