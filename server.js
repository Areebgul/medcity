const express = require('express');
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const app = express();
const mysql = require('mysql');
var multer  = require('multer')
var cors = require('cors');
var upload = multer({ dest: 'uploads/' })
var path = require('path');

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'db_medcity',
//     multipleStatements: true
// });

const connection = mysql.createConnection({
    host: '51.255.16.156',
    user: 'aditecha_medcity',
    password: 'aditecha_medcity',
    database: 'aditecha_medcity',
    multipleStatements: true
});

var pool = mysql.createPool({
    connectionLimit: 5,
    host: '51.255.16.156',
    user: 'aditecha_medcity',
    password: 'aditecha_medcity', 
    database: 'aditecha_medcity'
});

connection.connect(function(err){
    (err) ? console.log(err): console.log(connection);
});

pool.getConnection(function(err, connection) {
    app.get('/tbl_newquestions123', function (req, res) {
        connection.query('Select * from tbl_newquestions WHERE question_id=(SELECT max(question_id) FROM tbl_newquestions)', function (err, data) {
            (err) ? res.send(err) : res.json(data);
        });
    });
    connnection.release();
  });

app.use(express.static(`${__dirname}/uploads`));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cors());



require('./routes/html-routes')(app, connection, upload);

// SET STORAGE
let file_name = Date.now();
let image_name = file_name;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
      image_name = file_name + '-' +file.originalname;
      cb(null, image_name );
  }
});

var upload = multer({ storage: storage }).single('file');
require('./routes/html-routes_image')(app, connection, upload, multer, image_name);

/* Start the server */
app.listen(PORT, ()=> {
    console.log(`Example app listening on port ${PORT}!`);
});