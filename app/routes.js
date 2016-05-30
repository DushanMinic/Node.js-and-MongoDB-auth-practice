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
	// app.post('/login', do all out passport stuff here)

	// =====
	// SIGN UP ========
	// ====== show the Sign up Form
	app.get('/signup', function (req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// Process the Sign Up form
	// app.post('/signup', do all out passport stuff here);

	// =======
	// PROFILE SECTION ====
	// ================
	// We will want this protected so you have to be logged in to visit
	// We will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function (req, res) {
		res.render('profile.ejs', {
			user: req.user // Get the user out of session and pass it to template
		});
	});

	// =========
	// LOGOUT =====
	//=====
	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
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