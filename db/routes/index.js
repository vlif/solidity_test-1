var express = require('express');
var router = express.Router();

/* GET home page. */
/*router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
*/
router.get('/', function(req, res, next) {
    var db = req.con;
    var data = "";

    var user = "";
    var user = req.query.address;
    console.log("user");
    var filter = "";
    if (user) {
    	filter = 'WHERE address = ?';
    }

    db.query('SELECT * FROM info' + filter,user, function(err, rows) {
        if (err) {
            console.log(err);
        }
        var data = rows;
	console.log(data);
        // use index.ejs
        res.render('index', { title: 'Account Information', data: data, user:user});
    });

});
router.get('/add', function(req, res, next) {

    // use userAdd.ejs
    res.render('userAdd', { title: 'Add User'});
});

// add post
router.post('/userAdd', function(req, res, next) {

    var db = req.con;

    var sql = {
        address: req.body.address,
        name: req.body.name,
        abi: req.body.abi,
    	contract:req.body.contract
    };

    console.log(sql);
    var qur = db.query('INSERT INTO info SET ?', sql, function(err, rows) {
        if (err) {
            console.log(err);
        }
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/');
    });

});

//edit page
router.get('/userEdit', function(req, res, next) {

    var address = req.query.address;
    var db = req.con;
    var data = "";

    db.query('SELECT * FROM info WHERE address = ?', address, function(err, rows) {
        if (err) {
            console.log(err);
        }

        var data = rows;
	console.log(data);
        res.render('userEdit', { title: 'Edit info', data: data });
    });

});

//post
router.post('/userEdit', function(req, res, next) {

    var db = req.con;
    var address = req.body.address;

    var sql = {
        name: req.body.name,
       	abi: req.body.abi,
        contract: req.body.contract
    };

    var qur = db.query('UPDATE info SET ? WHERE address = ?', [sql, address], function(err, rows) {
        if (err) {
            console.log(err);
        }

        res.setHeader('Content-Type', 'application/json');
        res.redirect('/');
    });

});
router.get('/userDelete', function(req, res, next) {

    var addr = req.query.address;
    var db = req.con;

    var qur = db.query('DELETE FROM info WHERE address = ?',addr, function(err, rows) {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
});
module.exports = router;
