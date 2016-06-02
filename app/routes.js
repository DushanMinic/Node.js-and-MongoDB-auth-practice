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


	// GOOGLE ROUTES
	// =========

	app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] } ));

	// The callback after Google has authenticated the user
	app.get('/auth/google/callback', passport.authenticate('google', {
			successRedirect : '/profile',
			failureRedirect: '/'
		}));

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

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

// LOCALLY
app.get('/connect/local', function(req, res) {
	res.render('connect-local.ejs', { message: req.flash('loginMessage') })
});

app.post('/connect/local', passport.authenticate('local-signup', {
	successRedirect: '/profile',
	failureRedirect: '/connect/local',
	failureFlash: true
}));

// FACEBOOK
// Send to Facebook to do the authentication
app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

// Handle the callback after FB has authorized
app.get('/connect/facebook/callback', passport.authorize('facebook', {
	successRedirect: '/profile',
	failureRedirect: '/'
}));

// TWITTER
app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

app.get('/connect/twitter/callback', passport.authorize('twitter', {
	successRedirect: '/profile',
	failureRedirect: '/'
}));

// GOOGLE
app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

app.get('/connect/google/callback', passport.authorize('google', {
	successRedirect: '/profile',
	failureRedirect: '/'
}));


// ====== UNLINK ACCOUNTS =========

// LOCAL
app.get('/unlink/local', function(req, res) {

	var user = req.user;
	user.local.email = undefined;
	user.local.password = undefined;
	user.save(function(err) {
		res.redirect('/profile');
	});
});

// FACEBOOK
app.get('/unlink/facebook', function(req, res) {
	
	var user = req.user;
	user.facebook.token = undefined;
	user.save(function(err){
		res.redirect('/profile');
	});
});

// GOOGLE
app.get('/unlink/google', function(req, res) {
	
	var user = req.user;
	user.google.token = undefined;
	user.save(function(err){
		res.redirect('/profile');
	});
});

// TWITTER
app.get('/unlink/twitter', function(req, res) {
	
	var user = req.user;
	user.twitter.token = undefined;
	user.save(function(err){
		res.redirect('/profile');
	});
});


	// =========
	// LOGOUT =====
	//=====
	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
		// req.session.destroy(function (err) {
		// 	res.redirect('/');
		// });
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