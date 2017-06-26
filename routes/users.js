var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var User = require('../models/user');

//Register
router.get('/register',function(req,res){
	res.render('register');
})

//register form post action
router.post('/register',function(req,res){

	var name = req.body.name;
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;

	req.checkBody('name','Name is required').notEmpty();
	req.checkBody('username','Username is required').notEmpty();
	req.checkBody('email','Email is required').notEmpty();
	req.checkBody('email','You entered an invalid email').isEmail();
    req.checkBody('password','Password required').notEmpty();
    req.checkBody('password2','You need to confirm your password').equals(req.body.password);

	var errors = req.validationErrors();

    if (errors) {
    	res.render('register',{
    		errors:errors
    	})
    }  else{
	       var newUser = new User({
	       	name:name,
	       	username:username,
	       	email:email,
	       	password:password
	    })

	       User.createUser(newUser,function(err,user){
	       	 if (err) {
	       	 	throw err;
	       	 }
	       	 console.log(user);
	       });



	  
	  req.flash('success_msg','You are registered and can now log in');

	  res.redirect('/users/login');

    }

})


//login route
router.get('/login',function(req,res){
	res.render('login');
})


passport.use(new LocalStrategy(
  function(username, password, done) {
     User.getUserByUsername(username,function(err,user){
     	if (err) throw err;
     	if(!user){
     		return done(null,false,{message:'Unknown User'});
     	}
     });

     User.comparePassword(password,user.password,function(err, isMatch){
     	if (err) throw err;
     	if(isMatch){
     		return done(null,user);
     	}else{
     		return done(null,false,{message:'Invalid password'});
     	}
     })

  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getById(id, function(err, user) {
    done(err, user);
  });
});




router.post('/login',
  passport.authenticate('local',{
  	successRedirec:'/',
  	failureRedirect:'/users/login',
  	failureFlash:true
  }),
      function(req, res) {
        res.redirect('/');
    });

module.exports = router;  