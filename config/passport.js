// Load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// Load up the User model
var User = require('./app/user');

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
		process.nextThick(function () {

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
		});
	}
	));
};
