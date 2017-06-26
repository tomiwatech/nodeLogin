var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongodb = require('mongodb');
var mongoose = require('mongoose');


var routes = require('./routes/index');
var users = require('./routes/users');

//connect to mongoose
mongoose.connect('mongodb://127.0.0.1/loginapp');
var db = mongoose.connection;

// set the view engine
app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',exphbs({defaultLayout:'layout'}));
app.set('view engine','handlebars');

// Body parser middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}));

//public folder directory that houses all html,css and javascript
app.use(express.static(path.join(__dirname,'public')));

//express session
app.use(session({
	secret:'secret',
	saveUninitialized:true,
	resave:true
}));

//passport initialization
app.use(passport.initialize());
app.use(passport.session());

//express vaildator
app.use(expressValidator({
	errorFormatter:function(param,msg,value){
		var namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;

		while(namespace.length){
			formParam += '[' + namespace.shift() + ']';
		}
		return{
			param:formParam,
			msg: msg,
			value: value
		};
	}
}));

//connect flash

app.use(flash());

//global variables for flash messages

app.use(function(req,res,next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next(); 
})

app.use('/',routes);
app.use('/users',users);


//port listener
app.listen(3000);
console.log('App listening on port 3000');
