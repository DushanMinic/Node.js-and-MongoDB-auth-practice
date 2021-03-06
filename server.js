var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

// Configuration ==========
mongoose.connect(configDB.url); // Connect to our database

require('./config/passport')(passport); // Pass passport for configuration

// Set up Express Application

app.use(morgan('dev')); // Log every request to the console
app.use(cookieParser()); // Read cookies (needed for Auth)
app.use(bodyParser.urlencoded({ extended: true })); // Get information from HTML Forms

app.set('view engine', 'ejs'); // Set EJS as Template Engine

// Required for Passport

app.use(session({ secret: 'dusanminicnodejs', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session()); // Persistent Log In Sessions
app.use(flash()); // Use connect-flash for flash messages stored in session

// Routes ==========


require('./app/routes.js')(app, passport); // Load routes and pass in our app fully configured passport

// Launch =========
app.listen(port, function () {
	console.log('Server started on port:', port);
});
