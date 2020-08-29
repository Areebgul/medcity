const mysql = require('mysql');
var fs = require('fs');
var multer = require('multer');
const { time } = require('console');
// var upload = multer({ dest: 'uploads/' }); //setting the default folder for multer
// const logger = require('simple-node-logger').createSimpleLogger();
// const logger = require('simple-node-logger').createSimpleLogger('project.log');
const logger = require('simple-node-logger').createSimpleFileLogger('project.log');

module.exports = function (app, connection, upload) {

    app.get('/', function (req, res) {
        res.send("Welcome to medcity");
    });


    app.get('/areeb', function (req, res) {
        res.send("Welcome to areeb");
    });

/////////////////////,,,,,,,,,,,,,,,,,,,,,,,,,,,,,.////////////////////
/////////////////////Customer Apis Start From here ////////////////////
/////////////////////'''''''''''''''''''''''''''''/////////////////////



//// Customer Log in ///////

app.post('/login', function (req, res, next) {
    var user_email = req.body.email;
    var user_password = req.body.password;
    console.log(user_email);

    connection.query('Select * from tbl_user WHERE user_email = ? AND user_password = ?', [user_email, user_password], function (err, row, fields, data) {
        if (err) console.log(err);

        if (row.length > 0) {
            // (err) ? res.send(err) : res.json(data);
            res.send({ 'success': true, 'message': row[0].user_type, })
        }
        else {
            res.send({ 'success': false, 'message': 'user not found, please try again' });
        }


    });
});

//let data during Login........


app.post('/getCustommerData', function (req, res) {
    var user_email = req.body.email;
    var user_password = req.body.password;
    console.log("Zaka..");
    console.log(user_email);
    console.log(user_password);

    connection.query("Select * from tbl_user WHERE user_email = '" + user_email + "' AND user_password = '" + user_password + "' ", function (err, data) {
        if (err) {
            res.json("0");
        }
        else {
            console.log('Zaka Result...')
            console.log(data)
            res.json(data);
        }

    });
});


//////////////////////////////// Customer Login End //////////////////////////

////////////////////////////////Question getting //////////////////////////////

app.get('/tbl_newquestions', function (req, res) {
    connection.query('Select * from tbl_newquestions WHERE question_id=(SELECT max(question_id) FROM tbl_newquestions)', function (err, data) {
        (err) ? res.send(err) : res.json(data);
    });
});


app.get('/tbl_newquestions123', function (req, res) {
    connection.query('Select * from tbl_newquestions WHERE question_id=(SELECT max(question_id) FROM tbl_newquestions)', function (err, data) {
        (err) ? res.send(err) : res.json(data);
    });
});
// insert Answer..............

app.post('/insertIntoAnswer', function (req, res) {
    let cart = req.body;

    ////////////
    let data = { question_id: cart.questionID, customer_id: cart.customerID, user_ans: cart.userAns, correct_ans: cart.correctAns, points: cart.points };
    let sql = "INSERT INTO answer SET ?";
    let query = connection.query(sql, data, (err, results) => {
        if (err) {
            res.json(err);
        }
        else {
            res.json("1");
        }
    });

});

////////////////////////////////Question End /////////////////////////


////////////////////////////// Customer Order /////////////////////////////

app.post('/insertIntoUserOrder', function (req, res) {
    let cart = req.body;

    ////////////
    let data = { address: cart.address, phone_no: cart.phone, email: cart.email, customer_id: cart.customerID };
    let sql = "INSERT INTO tbl_user_order SET ?";
    let query = connection.query(sql, data, (err, results) => {
        if (err) {
            res.json(err);
        }
        else {
            res.json("1");
        }
    });

});

// get Order id to store product ...................

app.post('/getUserOrderID', function (req, res) {
    connection.query("SELECT order_id FROM tbl_user_order WHERE order_id=(SELECT max(order_id) FROM tbl_user_order) AND customer_id = '" + req.body.customerID + "' ", function (err, data) {
        if (err) {
            res.send(err)
        }
        else {

            res.json(data);
        }
    });
});

//insert Order Product...............................

app.post('/insertIntoOrderProduct', function (req, res) {
    let cart = req.body;

    ////////////
    let data = { product_id: cart.productID, quantity: cart.quantity, order_id: cart.orderID, product_price: cart.product_price };
    let sql = "INSERT INTO tbl_order_product SET ?";
    let query = connection.query(sql, data, (err, results) => {
        if (err) {
            res.json(err);
        }
        else {
            res.json("1");
        }
    });

});

/////////////////////////////Customer Order End /////////////////////////////////////////


//////////////////////////////Show All Products ///////////////////////////////////////
app.get('/OrdersDATA1', function (req, res) {
    connection.query('Select * from tbl_product', function (err, data) {
        (err) ? res.send(err) : res.json(data);
    });
});

app.post('/OrdersDATA', function (req, res) {
    connection.query('Select * from tbl_product', function (err, data) {
        (err) ? res.send(err) : res.json(data);
    });
});

////////////////////////////Show Products end //////////////////////////////////////////


//////////////////////////Customer Registration ////////////////////////////////////

app.post('/ADDUSERS', upload.single('avatar'), function (req, res, next) {
    let data = { user_img: req.body.img, user_first_name: req.body.user_first_name, user_last_name: req.body.user_last_name, user_email: req.body.user_email, user_password: req.body.user_password, user_gender: req.body.user_gender, user_type: "customer" };
    console.log(data.user_first_name);
    console.log(data.user_last_name);
    console.log(data.user_email);
    console.log(data.user_password);
    console.log(data.user_gender);
    let sql = "INSERT INTO tbl_user SET ?";
    let query = connection.query(sql, data, (err, results) => {
        if (err) {
            res.json("error");
        }
        else {
            res.json('1')
        }
    });
});

///////////////////////////////////Customer Registration End //////////////////////////



/////////////////////////////////////////////////////////////
/////////////For Uploading Pic By Zaka///////////////
/////////////////////////////////////////////////////////////

/////////////////////////Other Setting /////////////////////
// let file_name = Date.now();
// let file_name = rendomNumVar;

// let image_name = file_name;
let image_name ="";
var storage = multer.diskStorage({
destination: function (req, file, cb) {
    cb(null, 'uploads')
},
filename: function (req, file, cb) {
    // image_name = file_name + '-' + file.originalname;
    image_name = file.originalname;
    cb(null, image_name);
}
});
///////////////////////////image Upload...............
app.post('/uploadCustomerImage', multer({ storage: storage }).single('fileData'), (req, res, next) => {
console.log('Function Running...')
logger.info(req.file);//this will be automatically set by multer
logger.info(req.body);
// below code will read the data from the upload folder. Multer     will automatically upload the file in that folder with an  autogenerated name
fs.readFile(req.file.path, (err, contents) => {
    if (err) {
        console.log('Error: ', err);

    } else {
        console.log('File contents ', contents);

    }
});


});
/////////////////// End /////////////////////


/////////////////////,,,,,,,,,,,,,,,,,,,,,,////////////////////
/////////////////////Customer Apis End Here////////////////////
/////////////////////''''''''''''''''''''''/////////////////////


//===============================================================

/////////////////////,,,,,,,,,,,,,,,,,,,,,,////////////////////
/////////////////////Admin Apis Start Here////////////////////
/////////////////////''''''''''''''''''''''/////////////////////




/////////////////////////Count Driver//////////////////////

app.post('/countDriver', function (req, res) {
    connection.query('SELECT COUNT(user_id) AS driver FROM tbl_user WHERE user_type ="driver"', function (err, data) {
        if (err) {
            res.send(err)
        }
        else {
            res.json(data);
        }
    });
});

/////////////////////////Count Driver End///////////////////////////


////////////////////////Count Product Start///////////////////////

app.post('/countProduct', function (req, res) {
    connection.query('SELECT COUNT(product_id) AS product FROM tbl_product', function (err, data) {
        if (err) {
            res.send(err)
        }
        else {
            res.json(data);
        }
    });
});

///////////////////////Count Product End///////////////////////////////////

///////////////////////////Count New Order Start///////////////////////////

app.post('/countNewOrder', function (req, res) {
    connection.query('SELECT COUNT(order_id) AS der FROM tbl_user_order WHERE status ="pending"', function (err, data) {
        if (err) {
            res.send(err)
        }
        else {
            res.json(data);
        }
    });
});

/////////////////////////////////Count New Oreder End/////////////////////////////////


////////////////////////Count Complete Order Start//////////////////////////////////

app.post('/countCompleteOrder', function (req, res) {
    connection.query('SELECT COUNT(order_id) AS der FROM tbl_user_order WHERE status ="completed"', function (err, data) {
        if (err) {
            res.send(err)
        }
        else {
            res.json(data);
        }
    });
});

/////////////////////////Count Complete order End/////////////////////////////


//////////////////////////Get Data of Completed Order Start////////////////

app.post('/getCompletedOrder', function (req, res) {
    connection.query('SELECT tbl_user_order.*, tbl_user.* FROM tbl_user_order INNER JOIN tbl_user ON tbl_user_order.customer_id = tbl_user.user_id WHERE status ="completed"', function (err, data) {
        if (err) {
            res.send(err)
        }
        else {
            res.json(data);
        }
    });
});

/////////////////////////Get Data of Completed Order End///////////////////////////



////////////////////////Get Driver Data Start//////////////////////////////

app.post('/getDriver', function (req, res) {
    connection.query('SELECT * FROM tbl_user WHERE user_type ="driver"', function (err, data) {
        if (err) {
            res.send(err)
        }
        else {
            res.json(data);
        }
    });
});

///////////////////////Get Driver Data End/////////////////////////////

///////////////////////Delete Driver Start/////////////////////////////

app.post('/deleteDriver', function (req, res) {
    connection.query('DELETE FROM tbl_user WHERE user_id = "'+req.body.driverID+'" AND user_type = "driver" ', function (err, data) {
        if (err) {
            res.send(err)
        }
        else {
            res.json('1');
        }
    });
});

/////////////////////////Delete Driver End////////////////////////////////////


///////////////////////////Edit Driver Start//////////////////////////////////////

app.post('/editDriver', function (req, res) {
    connection.query('UPDATE tbl_user SET user_first_name = "'+req.body.firstName+'", user_last_name = "'+req.body.lastName+'", user_email = "'+req.body.email+'", user_password = "'+req.body.password+'", user_gender = "'+req.body.gender+'" WHERE user_id ="'+req.body.driverID+'"  ', function (err, data) {
        if (err) {
            res.send(err)
        }
        else {
            res.json('1');
        }
    });
});

//////////////////////////////////Edit Driver End////////////////////////////



////////////////////////////Insert Druiver ///////////////////////////////

app.post('/insertIntoUser', function (req, res) {
    let cart = req.body;

    ////////////
    let data = { user_img: cart.img, user_first_name: cart.firstName, user_last_name: cart.lastName, user_email: cart.email, user_password: cart.password , user_gender: cart.gender,user_type: 'driver' };
                    let sql = "INSERT INTO tbl_user SET ?";
                    let query = connection.query(sql, data, (err, results) => {
                        if(err){
                            res.json("0");
                        } 
                        else
                        {
                            res.json("1");
                        }
                    });

});

////////////////////////////////Insert Driver End //////////////////////////////

/////////////////////////////Get Pending/New Order Start/////////////////////////

app.post('/getPendingOrder', function (req, res) {
    connection.query('SELECT tbl_user_order.*, tbl_user.* FROM tbl_user_order INNER JOIN tbl_user ON tbl_user_order.customer_id = tbl_user.user_id WHERE status ="pending"', function (err, data) {
        if (err) {
            res.send(err)
        }
        else {
            res.json(data);
        }
    });
});

/////////////////////////Get Pending/New Order End//////////////////////////////////////////


////////////////////////Get Product Start/////////////////////////////////

app.post('/getProduct', function (req, res) {
    connection.query('SELECT * FROM tbl_product', function (err, data) {
        if (err) {
            res.send(err)
        }
        else {
            res.json(data);
        }
    });
});

///////////////////////Get Product End////////////////////////////////////////


//////////////////////Delete Product Start///////////////////////////////

app.post('/deleteProduct', function (req, res) {
    connection.query('DELETE FROM tbl_product WHERE product_id = "'+req.body.productID+'" ', function (err, data) {
        if (err) {
            res.send(err)
        }
        else {
            res.json('1');
        }
    });
});

////////////////////////////Delete Product End//////////////////////////



/////////////////////,,,,,,,,,,,,,,,,,,,,,,////////////////////
/////////////////////Admin Apis End Here////////////////////
/////////////////////''''''''''''''''''''''/////////////////////

//===================================================================


/////////////////////,,,,,,,,,,,,,,,,,,,,,,////////////////////
/////////////////////Driver Apis Start Here////////////////////
/////////////////////''''''''''''''''''''''/////////////////////




////////////////////////Get Complete Order Start////////////////////////////

// .............Same As Admin Api..........................

//////////////////////////////Get Complete order End//////////////////////////////



////////////////////////////Get Pending Order Start///////////////////////////////

// .............Same As Admin Api..........................

////////////////////////////////////Get Pending Order End////////////////////////////


////////////////////////////////////Go to Running Start //////////////////////////

app.post('/gotoRunning', function (req, res) {
    connection.query('UPDATE tbl_user_order SET status ="running"  WHERE order_id ="'+req.body.orderID+'"  ', function (err, data) {
        if (err) {
            res.send(err)
        }
        else {
            res.json('1');
        }
    });
});

/////////////////////////////////Goto Running End /////////////////////////////////////

/////////////////////////Get Running Order Start /////////////////////////////////////

app.post('/getRunningOrder', function (req, res) {
    connection.query('SELECT tbl_user_order.*, tbl_user.* FROM tbl_user_order INNER JOIN tbl_user ON tbl_user_order.customer_id = tbl_user.user_id WHERE status ="running"', function (err, data) {
        if (err) {
            res.send(err)
        }
        else {
            res.json(data);
        }
    });
});

///////////////////////////////////Get Running Order End/////////////////////////////////////


////////////////////////Goto Completed Start///////////////////////////////////////////

app.post('/gotoCompleted', function (req, res) {
    connection.query('UPDATE tbl_user_order SET status ="completed"  WHERE order_id ="'+req.body.orderID+'"  ', function (err, data) {
        if (err) {
            res.send(err)
        }
        else {
            res.json('1');
        }
    });
});

//////////////////////////Goto Completed End /////////////////////////




};