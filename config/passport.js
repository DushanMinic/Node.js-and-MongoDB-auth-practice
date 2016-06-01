// Load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').Strategy;

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


	


	// ===========
	// TWITTER =====

	passport.use(new TwitterStrategy({
		consumerKey : configAuth.twitterAuth.consumerKey,
		consumerSecret : configAuth.twitterAuth.consumerSecret,
		callbackURL : configAuth.twitterAuth.callbackURL
	},
	function(token, tokenSecret, profile, done) {
		// Asynchronous
		process.nextTick(function () {
			User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
				if(err)
				return done(err);

			// If the user is found, log it in
			if(user) {
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

		});
	}

	));

	//==== FACEBOOK =====

	passport.use(new FacebookStrategy({
		// Pull in App ID and App Secret from auth.js file
		clientID : configAuth.facebookAuth.clientID,
		clientSecret : configAuth.facebookAuth.clientSecret,
		callbackURL : configAuth.facebookAuth.callbackURL,
		profileFields : ["emails", "displayName", "picture.type(large)"]
},
		// Facebook will send back the token and profile
		function(token, refreshToken, profile, done) {
			// Asynchronous
			process.nextTick(function () {

				// Find the user in the database based on their Facebook ID
				User.findOne({ 'facebook.id' : profile.id }, function (err, user) {
					// If there is an error, stop everything and return error
					if (err)
						return done(err);

					// If the user is found, log him in
					if(user) {
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

