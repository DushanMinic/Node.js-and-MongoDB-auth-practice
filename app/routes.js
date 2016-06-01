module.exports = function (app, passport) {

	// Home Page with Log In links
	app.get('/', function (req, res) {
		res.render('index.ejs'); // Load the index.ejs file
	});

	// LOGIN =====
	//====
	//=== Show the log in form

	// Render the page and pass in any flash data if it exists
	app.get('/login', function (req, res) {
		res.render('login.ejs', {message: req.flash('loginMessage') });
	});

	// Process the Log In form
	 app.post('/login', passport.authenticate('local-login', {
	 	successRedirect: '/profile',
	 	failureRedirect: '/login',
	 	failureFlash: true // Allow flash messages
	 }));

	// =====
	// SIGN UP ========
	// ====== show the Sign up Form
	app.get('/signup', function (req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// Process the Sign Up form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile', // Redirect back to secure profile section
		failureRedirect: '/signup', // Redirect back to signup page if there is an error
		failureFlash: true // Allow flash messages
	}));

	// =======
	// PROFILE SECTION ====
	// ================
	// We will want this protected so you have to be logged in to visit
	// We will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function (req, res) {
		res.render('profile.ejs', {
			user: req.user, // Get the user out of session and pass it to template
			// picture: 'https://graph.facebook.com/' + req.user.facebook.id + '/picture?height=350&width=250'
		});
	});

	// == TWITTER ROUTES
	// ====
	app.get('/auth/twitter', passport.authenticate('twitter'));

	// Handle the callback after Twitter has authenticated the user
	app.get('/auth/twitter/callback', passport.authenticate('twitter', {
		successRedirect : '/profile',
		failureRedirect : '/'
	}));

	//============================
	// ===== FACEBOOK ROUTES =====

	// Route for FB authentication and login
	app.get('/auth/facebook', passport.authenticate('facebook', {scope : ['email'] }));

	// Handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback', 
		passport.authenticate('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));



	// =========
	// LOGOUT =====
	//=====
	app.get('/logout', function (req, res) {
		// req.logout();
		// res.redirect('/');
		req.session.destroy(function (err) {
			res.redirect('/');
		});
	});

};

// Route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
	// If user is auth-ed in the session, carry on
	if(req.isAuthenticated())
		return next();
	// If they aren't, redirect them to home page
	res.redirect('/');
}