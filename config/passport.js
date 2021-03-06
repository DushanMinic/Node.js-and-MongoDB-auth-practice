// Load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Load up the User model
var User = require('../app/user');

// Load the Auth variables
var configAuth = require('./auth');

// Expose this function to our app
module.exports = function(passport) {

	// =======
	// Passport session setup
	// ====
	// Required for persistent login sessions
	// Passport needs abilty to serialize and unserialize users out of session

	// Used to serialize user for session
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	// Used to deserialize user
	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});


	// == GOOGLE
	// ==========

	passport.use(new GoogleStrategy({
		clientID: configAuth.googleAuth.clientID,
		clientSecret : configAuth.googleAuth.clientSecret,
		callbackURL : configAuth.googleAuth.callbackURL,
		passReqToCallback: true
	},
		function(req, token, refreshToken, profile, done) {
			process.nextTick(function () {

				if(!req.user) {

				// Finding user based on their Google ID
				User.findOne({ 'google.id' : profile.id }, function (err, user) {
					if(err)
						return done(err);

					if(user) {

						if(!user.google.token) {
							user.google.token = token;
							user.google.name = profile.displayName;
							user.google.email = profile.emails[0].value;

							user.save(function(err) {
								if(err)
									throw err;
								return done(null, user);
							});
						}

						// If user is found
						return done(null, user);
					} else {
						var newUser = new User();

						newUser.google.id = profile.id;
						newUser.google.token = token;
						newUser.google.name = profile.displayName;
						newUser.google.email = profile.emails[0].value; // Pull the first value

						// Save the user into database
						newUser.save(function(err) {
							if(err) throw err;
							return done(null, newUser);
						});

					}

				});
			} else {

				var user = req.user;

				user.google.id = profile.id;
				user.google.token = token;
				user.google.name = profile.displayName;
				user.google.email = profile.emails[0].value;

				user.save(function(err) {
					if(err)
						throw err;

					return done(null, user);
				});


			}



			});
		}

	));


	// ===========
	// TWITTER =====

	passport.use(new TwitterStrategy({
		consumerKey : configAuth.twitterAuth.consumerKey,
		consumerSecret : configAuth.twitterAuth.consumerSecret,
		callbackURL : configAuth.twitterAuth.callbackURL,
		passReqToCallback: true
	},
	function(req, token, tokenSecret, profile, done) {
		// Asynchronous
		process.nextTick(function () {
			if(!req.user) {
			User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
				if(err)
				return done(err);

			// If the user is found, log it in
			if(user) {

				if(!user.twitter.token) {
					user.twitter.token = token;
					user.twitter.username = profile.username;
					user.twitter.displayName = profile.displayName;

					user.save(function(err){
						if(err)
							throw err;
						return done(null, user);
					});
				}

				return done(null, user);
			} else {
				// If there is no user, create it
				var newUser = new User();

				// Set all the data
				newUser.twitter.id = profile.id;
				newUser.twitter.token = token;
				newUser.twitter.username = profile.username;
				newUser.twitter.displayName = profile.displayName;

				// Save the user in database
				newUser.save(function (err) {
					if(err)
						throw err;
					return done(null, newUser);
				});

			}
			});
	} else {
		var user = req.user;

		user.twitter.id = profile.id;
		user.twitter.token = token;
		user.twitter.username = profile.username;
		user.twitter.displayName = profile.displayName;

		user.save(function(err) {
			if(err)
				throw err;
			return done(null, user);
		});
	}


		});
	}

	));

	//==== FACEBOOK =====

	passport.use(new FacebookStrategy({
		// Pull in App ID and App Secret from auth.js file
		clientID : configAuth.facebookAuth.clientID,
		clientSecret : configAuth.facebookAuth.clientSecret,
		callbackURL : configAuth.facebookAuth.callbackURL,
		profileFields : ["emails", "displayName", "picture.type(large)"],
		passReqToCallback : true // Allows us to pass in the req from our route (lets us check if a user is logged in or not)
},
		// Facebook will send back the token and profile
		function(req, token, refreshToken, profile, done) {
			// Asynchronous
			process.nextTick(function () {

				// Check if the user is logged in
				if(!req.user) {

				// Find the user in the database based on their Facebook ID
				User.findOne({ 'facebook.id' : profile.id }, function (err, user) {
					// If there is an error, stop everything and return error
					if (err)
						return done(err);

					// If the user is found, log him in
					if(user) {

						// If there is a user id already but no token (user was linked at one point and then removed)
                        // Just add our token and profile information
                        if(!user.facebook.token) {
                        	user.facebook.token = token;
                        	user.facebook.name = profile.displayName;
                        	user.facebook.email = profile.emails[0].value;

                        	user.save(function(err) {
                        		if(err)
                        			throw err;
                        		return done(null, user);
                        	});
                        }

						return done(null, user); // User found, return that user
					} else {

						//If there is no User, create it

						var newUser = new User ();

						// Set all of the Facebook information in User model
						newUser.facebook.id = profile.id; // Set the User's Facebook ID
						newUser.facebook.token = token; // Saving the token that FB provides to User
						newUser.facebook.name = profile.displayName; // Passport Facebook User profile
						newUser.facebook.email = profile.emails[0].value; // Facebook can return multiple emails, returning first here


						// Save the user to database 
						newUser.save(function (err) {
							if(err)
								throw err;

							// If successful, return the new User
							return done(null, newUser);
						});
					}

				});

			} else {
				// User exists and is logged in, link accounts
				var user = req.user; // Pull the user out of the session

				// Update the current Facebook credentials
				user.facebook.id = profile.id;
				user.facebook.token = token;
				user.facebook.name = profile.displayName;
				user.facebook.email = profile.emails[0].value;

				// Saving the user
				user.save(function (err) {
					if(err) 
						throw err;

					return done(null, user);
				});

			}

			});

	}));

	// ====
	// LOCAL SIGN UP ====
	// We are using named strategies since we have one for login and one for signup
	// By default, if there was no name it would be called 'local'

	passport.use('local-signup', new LocalStrategy({
		// By default LocalStrategy uses username and password, we will override with email
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true // allows us to pass the entire request to the callback
	},
	function (req, email, password, done) {
		// Asynchronous
		// User.findOne won't fire unless data is sent back
		

			// Find user whose email is the same as forms email
			// We are checking to see if the user is trying to login already
			User.findOne({ 'local.email': email }, function (err, user) {
				// If there are any errors, return the error
				if(err)
				 return done(err);

				// Check to see if there is already user with that email
				if(user) {
					return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
				} else {

					// If there is no user with that email, create the user
					var newUser = new User();

					// Set the user's local credentials
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password); // use the generateHash function in our User model

					// Save the User
					newUser.save(function(err) {
						if(err) 
							throw err;
						return done(null, newUser);
					});

				}

			});
		
	}
	));


// =====
// Local Login ======
// We are using named strategies since we have one for login and one for signup
// By default, if there was no name it would be called 'local'
passport.use('local-login', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true // Allows us to pass the entire request to the callback
},
function(req, email, password, done) { // Callback from email and password from our form

	// Find a user whose email is the same as the forms email
    // We are checking to see if the user trying to login already exists
    User.findOne({ 'local.email' : email }, function(err, user) {
    	// If there are any errors, return them before anything else
    	if (err) 
    		return done(err);

    	// If no user is found, return the message
    	if(!user) 
    		return done(null, false, req.flash('loginMessage', 'No user found. Wrong email adress.')); // req.flash is the way to set flashdata using connect-flash

    	// If the user is found, but the password is wrong
    	if(!user.validPassword(password))
    		return done(null, false, req.flash('loginMessage', 'Oops, wrong password!'));

    	// All is well, return successful user
    	return done(null, user);

    });
}

));



};

