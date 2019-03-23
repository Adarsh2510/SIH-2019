var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var User = require('./models/user');
var Patient = require('./models/patient');
var path  = require('path');
var pg  = require('pg');


global.community = 2;
global.hospital = 4;

// invoke an instance of express application.
var app = express();

// set our application port
app.set('port', 9000);

// set morgan to log info about our requests for development use.
app.use(morgan('dev'));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
var data = "";
var msg = "nothing to worry";
var data2 ="";

const pool = new pg.Pool({
user: 'postgres',
host: '127.0.0.1',
database: 'auth-system',
password: '123456',
port: '5432'});

pool.query("SELECT * FROM public.patients", (err, res) => {
console.log(err, res);

data = JSON.stringify(res.rows);
});
// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));


// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});


// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }    
};



// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});


// route for user signup
app.route('/signup')
    .get(sessionChecker, (req, res) => {
        res.render('signup',{
            title:'signup',
        });	
    })
    .post((req, res) => {
        User.create({          
        username: req.body.username,
	    email:req.body.email,
	    password:req.body.password,
	    usertype:req.body.usertype,
		weight:req.body.weight,
		description:req.body.description,
		gender:req.body.gender
        })
        .then(user => {
            req.session.user = user.dataValues;
	    if(user.usertype == 1){
			global.community = 1;
			global.hospital = 0;
            res.redirect('/dashboard');
} else if(user.usertype == 2){
	global.community = 0;
	global.hospital = 1;
	res.redirect('/dashboard2');
}	else {
	res.redirect('/signup');
}
        })
        .catch(error => {
            res.redirect('/signup');
        });
    });

//route for community signup

app.route('/communitydashboard')
    .get(sessionChecker, (req, res) => {
		if (req.session.user && req.cookies.user_sid){
			if (global.community == 1){
                res.render('communitydashboard',{
                    title:'communitydashboard',comm : data,
                });	
		} else {
			res.render('communitydashboard',{
                title:'communitydashboard',comm : data,
            });	
		}
	}
    })
    .post((req, res) => {
        Patient.create({          
        firstname: req.body.firstname,
	    lastname: req.body.lastname,
	    age:req.body.age,
		weight:req.body.weight,
	    bloodtype:req.body.bloodtype,
		description:req.body.description,
		gender:req.body.gender
        })
        .then(patient => {
            req.session.user = patient.dataValues;
			global.community = 1;
			global.hospital = 0;
			res.redirect('/communitydashboard');
        })
        .catch(error => {
            res.redirect('/communitydashboard');
        });
    });
	

// route for user Login
app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.render('login',{
            title:'login',
        });    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password,
			usertype = req.body.usertype;

        User.findOne({ where: { username: username } }).then(function (user) {
            if (!user) {
                res.redirect('/login');
            } else if (!user.validPassword(password)) {
                res.redirect('/login');
            } else if (user.usertype == 2){
				req.session.user = user.dataValues;
				global.hospital = 1;
				global.community = 0;
                res.render('hospitaldashboard',{
                    title:'hospitaldashboard',comm : data,
                });		    } else if (user.usertype == 1){
				req.session.user = user.dataValues;
				global.community = 1;
				global.hospital = 0;
                res.render('communitydashboard',{
                    title:'communitydashboard',comm : data,
                });		    } else {
                req.session.user = user.dataValues;
				global.community = 0;
				global.hospital = 0;
                res.redirect('/login');
            }
        });
    });

//route for hospital search id

app.route('/search')
    .post((req, res) => {
    var userid = req.body.userid;
    console.log("we are at post");
    Patient.findOne({ where: { uniqueid: userid } }).then(function (user) {
        if (!user) {
            console.log("user not found please check the ID again");
            res.send("oh shit it's an error");
        }
         else 
        {
            console.log("we are at else block");
             pool.query("SELECT * FROM patients WHERE uniqueid ="+ userid, (err, res) => {
                console.log(err, res);
                data = JSON.stringify(res.rows);
                });
          console.log(data2);
         res.render('hospitaldashboard',{
         title:'search',comm: data,
    });
    
    } 
    });
    
});

	
//dashboard check function

app.get('/dashboardcheck', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
			if(global.hospital == 1 && global.community == 0){
				global.hospital = 1; 
				global.community = 0;
			res.redirect('/dashboard2');
			}
    } else if(global.hospital == 0 && global.community == 1) {
			global.hospital = 0;
			global.community = 1;
			res.redirect('/dashboard');
    } else {
        res.render('login',{
            title:'login',
        });	}
});
	
//route for user dashboard
app.get('/dashboard', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
		if(global.community == 1 && global.hospital == 0){
            res.render('communitydashboard',{
                title:'communitydashboard',comm : data,
            });			} else{
				res.redirect('/dashboard2');
		}
	} else {
        res.render('login',{
            title:'login',
        });    }
});


// route for user2 dashboard
app.get('/dashboard2', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
			if(global.hospital == 1 && global.community == 0){
                res.render('hospitaldashboard',{
                    title:'hospitaldashboard',comm : data,
                });				} else {
				res.redirect('/dashboard');
			}
    } else {
       
    }
});

// route for user logout
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});


// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});
	

// start the express server
app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));	