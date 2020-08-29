const mysql = require('mysql');

module.exports = function (app, connection, upload, multer, image_name) {

    // Insert Category Here
    // app.post('/addCategory', function (req, res) {
    //     upload(req, res, function (err) {
    //         if (err instanceof multer.MulterError) {
    //             res.json("0");
    //         } else if (err) {
    //             res.json("0");
    //         }
    //         //Insert Code
    //         let filename = image_name + '-' + req.file.originalname;
    //         let data = { name: req.body.category, image: filename };
    //         let sql = "INSERT INTO tbl_category SET ?";
    //         let query = connection.query(sql, data, (err, results) => {
    //             if (err) {
    //                 res.json("0");
    //             }
    //             else {
    //                 res.json("1");
    //             }
    //         });
    //     });
    // });



    //  start of addproduct


    app.post('/product', function (req, res) {
        // console.log(" areeb"+req.file.originalname)
        // console.log(" req.body.title"+ req.body.title)
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                res.json("0");
            } else if (err) {
                res.json("0");
            }

            //Insert Code
            let filename = image_name + '-' + req.file.originalname;
            let data = { title: req.body.title, description: req.body.Description, quantity: parseInt(req.body.Quantity), price: parseInt(req.body.Price), category_id: parseInt(req.body.category_id), special_offer: parseInt(req.body.status), image: filename };
            let sql = "INSERT INTO tbl_product SET ?";
            let query = connection.query(sql, data, (err, results) => {
                if (err) {
                    res.json("0");
                }
                else {
                    res.json("1");
                }
            });
        });
    });
    /* End of addproduct */



    /* Start of Banner Image Functions */




    app.post('/uploadBottomBannerImage', function (req, res) {

        upload(req, res, function (err) {

            if (err instanceof multer.MulterError) {
                res.json("0");
            }
            else if (err) {
                res.json("0");
            }
            else {
                connection.query('Select COUNT(*) as total from tbl_banner Where position = "Bottom"', function (err, data) {

                    if (err) {
                        res.json("0");
                    }
                    else {
                        let count = parseInt(data[0].total, 10);
                        if (count > 0) {
                            let filename = image_name + '-' + req.file.originalname;
                            let sql = "update tbl_banner SET image='" + filename + "'where position = 'Bottom'";
                            let query = connection.query(sql, (err, results) => {
                                if (err) {
                                    res.json("0");
                                }
                                else {
                                    res.json("1");
                                }
                            });
                        }
                        else {
                            //Insert Code
                            let filename = image_name + '-' + req.file.originalname;
                            let data = { position: req.body.position, image: filename };
                            let sql = "INSERT INTO tbl_banner SET ?";
                            let query = connection.query(sql, data, (err, results) => {
                                if (err) {
                                    res.json("0");
                                }
                                else {
                                    res.json("1");
                                }
                            });
                        }
                    }
                });
            }
        });
    });

    /* End of Banner Image Functions */
};